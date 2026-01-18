import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useEffect, useState } from "react";
import { PACKAGE_ID } from "../constants";

const PROFILE_STORAGE_KEY = "infinite_deck_profiles";

export function usePlayerProfile() {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const [profileData, setProfileData] = useState<any>(null);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Check if profile exists in localStorage
  const checkLocalProfile = (address: string): boolean => {
    try {
      const profiles = JSON.parse(
        localStorage.getItem(PROFILE_STORAGE_KEY) || "{}",
      );
      return profiles[address] === true;
    } catch {
      return false;
    }
  };

  // Save profile to localStorage
  const saveLocalProfile = (address: string) => {
    try {
      const profiles = JSON.parse(
        localStorage.getItem(PROFILE_STORAGE_KEY) || "{}",
      );
      profiles[address] = true;
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profiles));
    } catch (error) {
      console.error("Error saving profile to localStorage:", error);
    }
  };

  // Check if profile exists on-chain
  const checkOnChainProfile = async (address: string): Promise<boolean> => {
    try {
      setIsChecking(true);

      // Query for PlayerProfile objects owned by the address
      const objects = await suiClient.getOwnedObjects({
        owner: address,
        filter: {
          StructType: `${PACKAGE_ID}::player_profile::PlayerProfile`,
        },
      });

      const exists = objects.data.length > 0;

      if (exists) {
        saveLocalProfile(address);
        // Fetch content
        const objectResp = await suiClient.getObject({
          id: objects.data[0].data!.objectId,
          options: { showContent: true },
        });
        if (objectResp.data?.content?.dataType === "moveObject") {
          const fields = objectResp.data.content.fields as any;
          setProfileData({
            id: objects.data[0].data!.objectId,
            username: fields.username,
            allCards: fields.all_cards,
            selectedDeck: fields.selected_deck,
            wins: fields.wins,
            losses: fields.losses,
            rankingPoints: fields.ranking_points,
          });
        }
      }

      setIsChecking(false);
      return exists;
    } catch (error) {
      console.error("Error checking on-chain profile:", error);
      setIsChecking(false);
      return false;
    }
  };

  // Create player profile
  const createProfile = async (username: string = "Player"): Promise<void> => {
    if (!currentAccount) {
      throw new Error("Wallet not connected");
    }

    setIsCreating(true);

    try {
      const tx = new Transaction();

      // Call create_profile_entry from the smart contract
      tx.moveCall({
        target: `${PACKAGE_ID}::player_profile::create_profile_entry`,
        arguments: [tx.pure.string(username)],
      });

      return new Promise((resolve, reject) => {
        signAndExecute(
          {
            transaction: tx,
          },
          {
            onSuccess: (result) => {
              console.log("Profile created successfully:", result);
              saveLocalProfile(currentAccount.address);
              setHasProfile(true);
              setIsCreating(false);
              resolve();
            },
            onError: (err) => {
              console.error("Error creating profile:", err);
              setIsCreating(false);
              reject(err);
            },
          },
        );
      });
    } catch (err) {
      setIsCreating(false);
      throw err;
    }
  };

  // Check profile on wallet connection
  useEffect(() => {
    if (currentAccount) {
      // Always try to fetch on-chain data to get latest state
      checkOnChainProfile(currentAccount.address).then((exists) => {
        setHasProfile(exists);
        if (exists) {
          saveLocalProfile(currentAccount.address);
        } else {
          // Auto-create only if we are sure it doesn't exist
          // (Optional: maybe ask user? For now keeping existing auto-create logic)
          createProfile().catch(console.error);
        }
      });
    } else {
      setHasProfile(false);
      setProfileData(null);
    }
  }, [currentAccount]);

  return {
    profile: profileData,
    loading: isChecking || isCreating,
    fetchProfile: () =>
      currentAccount && checkOnChainProfile(currentAccount.address),
    addCardToCollection: async (cardId: string) => {
      if (!profileData?.id || !currentAccount) return;
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::player_profile::add_card_to_collection`,
        arguments: [tx.object(profileData.id), tx.pure.id(cardId)],
      });
      await signAndExecute({ transaction: tx });
      checkOnChainProfile(currentAccount.address);
    },
    syncCards: async () => {
      if (!profileData?.id || !currentAccount) return;

      // 1. Fetch all owned Cards
      const cardObjects = await suiClient.getOwnedObjects({
        owner: currentAccount.address,
        filter: { StructType: `${PACKAGE_ID}::game::Card` },
      });

      const ownedCardIds = cardObjects.data
        .map((obj) => obj.data?.objectId)
        .filter(Boolean) as string[];
      const knownCardIds = new Set(profileData.allCards || []);

      // 2. Find missing cards
      const missingIds = ownedCardIds.filter((id) => !knownCardIds.has(id));

      if (missingIds.length === 0) {
        console.log("No cards to sync");
        return;
      }

      // 3. Add them to collection
      const tx = new Transaction();
      missingIds.forEach((id) => {
        tx.moveCall({
          target: `${PACKAGE_ID}::player_profile::add_card_to_collection`,
          arguments: [tx.object(profileData.id), tx.pure.id(id)],
        });
      });

      await signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            checkOnChainProfile(currentAccount.address);
          },
        },
      );
    },
    selectBattleDeck: async (cardIds: string[]) => {
      if (!profileData?.id || !currentAccount) return;
      if (cardIds.length !== 5) throw new Error("Deck must have 5 cards");
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::player_profile::select_battle_deck`,
        arguments: [tx.object(profileData.id), tx.pure.vector("id", cardIds)],
      });
      await signAndExecute({ transaction: tx });
      checkOnChainProfile(currentAccount.address);
    },
    hasProfile,
    isCreating,
    isChecking,
    createProfile,
  };
}
