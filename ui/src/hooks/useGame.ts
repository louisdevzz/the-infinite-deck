import { useState, useEffect, useCallback } from "react";
import {
  useSuiClient,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, RANDOM_OBJECT_ID } from "../constants";

export type GameState =
  | "IDLE"
  | "QUEUING"
  | "MATCH_FOUND"
  | "BATTLE_START"
  | "PLAYING"
  | "ENDED";

export function useGame(profileId: string | null, deck: string[]) {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const [gameState, setGameState] = useState<GameState>("IDLE");
  const [lobbyId, setLobbyId] = useState<string | null>(null);
  const [battleId, setBattleId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch Lobby ID
  useEffect(() => {
    const fetchLobby = async () => {
      try {
        // We'll try to find the shared Lobby object
        // In a real app, this should be indexed or hardcoded after deployment
        // For now, we unfortunately can't query shared objects by type easily without an indexer
        // We will rely on a known ID or searching recent transactions if possible.
        // However, without an Indexer, we might be stuck if we don't know it.
        // TEMPORARY: Assuming we need to configure it manually or user has to provide it?
        // Actually, let's try to query owned objects of the publisher? No.

        // If we can't find it, we might default to searching for it via events?
        // Let's assume for now we might need to hardcode it or the user provides it.
        // BUT, wait, I can try to find it by getting objects created by the package? No.

        // Let's add a placeholder for LOBBY_ID fetch.
        // For this coding task, I will leave it as null and maybe log a warning.
        console.warn(
          "Lobby ID logic needs implementation. Ensure LOBBY_ID is set.",
        );
      } catch (e) {
        console.error("Error fetching lobby", e);
      }
    };
    fetchLobby();
  }, []);

  // Helper to find BattleCapability
  const fetchBattleCap = useCallback(
    async (address: string): Promise<string | null> => {
      try {
        const resp = await client.getOwnedObjects({
          owner: address,
          filter: { StructType: `${PACKAGE_ID}::game::BattleCapability` },
          options: { showType: true },
        });
        if (resp.data.length > 0) {
          return resp.data[0].data?.objectId || null;
        }
        return null;
      } catch (e) {
        console.error("Error fetching battle cap", e);
        return null;
      }
    },
    [client],
  );

  const joinLobby = async () => {
    if (!import.meta.env.VITE_LOBBY_ID && !lobbyId) {
      setError("Lobby ID not found. Set VITE_LOBBY_ID.");
      return;
    }
    const targetLobbyId = import.meta.env.VITE_LOBBY_ID || lobbyId;

    if (!profileId || !account) {
      setError("Profile not loaded");
      return;
    }
    if (deck.length !== 5) {
      setError("Deck must have 5 cards");
      return;
    }

    try {
      const tx = new Transaction();
      // join_lobby takes 5 cards as individual arguments
      tx.moveCall({
        target: `${PACKAGE_ID}::matchmaking::join_lobby`,
        arguments: [
          tx.object(targetLobbyId!),
          tx.object(profileId),
          tx.object(deck[0]),
          tx.object(deck[1]),
          tx.object(deck[2]),
          tx.object(deck[3]),
          tx.object(deck[4]),
          tx.object(RANDOM_OBJECT_ID),
        ],
      });

      await signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            setGameState("QUEUING");
            setError(null);
          },
          onError: (err) => {
            setError("Failed to join lobby: " + err.message);
          },
        },
      );
    } catch (e: any) {
      setError(e.message);
    }
  };

  const cancelMatchmaking = async () => {
    if (!import.meta.env.VITE_LOBBY_ID && !lobbyId) return;
    if (!profileId || !account || deck.length !== 5) return;

    try {
      const tx = new Transaction();
      const targetLobbyId = import.meta.env.VITE_LOBBY_ID || lobbyId;

      tx.moveCall({
        target: `${PACKAGE_ID}::matchmaking::cancel_matchmaking`,
        arguments: [
          tx.object(targetLobbyId!),
          tx.object(profileId),
          tx.object(deck[0]),
          tx.object(deck[1]),
          tx.object(deck[2]),
          tx.object(deck[3]),
          tx.object(deck[4]),
        ],
      });

      await signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => setGameState("IDLE"),
          onError: (err) => setError("Failed to cancel: " + err.message),
        },
      );
    } catch (e: any) {
      setError(e.message);
    }
  };

  const summonCard = async (cardId: string) => {
    if (!battleId || !account) return;

    const capId = await fetchBattleCap(account.address);
    if (!capId) {
      setError("Battle Capability not found");
      return;
    }

    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::game::summon_card`,
      arguments: [tx.object(battleId), tx.object(capId), tx.pure.id(cardId)],
    });

    await signAndExecute({ transaction: tx });
  };

  const rollInitiative = async () => {
    if (!battleId || !account) return;
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::game::roll_initiative`,
      arguments: [tx.object(battleId), tx.object(RANDOM_OBJECT_ID)],
    });
    await signAndExecute({ transaction: tx });
  };

  const executeCombat = async (
    attackerIsPlayer1: boolean,
    card1Id: string,
    card2Id: string,
  ) => {
    if (!battleId) return;
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::game::execute_combat`,
      arguments: [
        tx.object(battleId),
        tx.object(card1Id),
        tx.object(card2Id),
        tx.pure.bool(attackerIsPlayer1),
      ],
    });
    await signAndExecute({ transaction: tx });
  };

  // Listen for MatchFound
  useEffect(() => {
    if (gameState !== "QUEUING" && gameState !== "IDLE") return;

    const unsubscribe = client.subscribeEvent({
      filter: { MoveEventType: `${PACKAGE_ID}::matchmaking::MatchFound` },
      onMessage: (event) => {
        const parsed = event.parsedJson as any;
        if (
          parsed.player1 === account?.address ||
          parsed.player2 === account?.address
        ) {
          setBattleId(parsed.battle_id);
          setGameState("MATCH_FOUND");
        }
      },
    });

    return () => {
      unsubscribe.then((unsub) => unsub());
    };
  }, [gameState, account, client]);

  return {
    gameState,
    battleId,
    joinLobby,
    cancelMatchmaking,
    summonCard,
    rollInitiative,
    executeCombat,
    error,
  };
}
