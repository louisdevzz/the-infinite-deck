import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";
import { PACKAGE_ID, RANDOM_OBJECT_ID } from "../constants";

interface ForgeCardParams {
  name: string;
  element: string;
  imageUrl: string;
}

export function useForgeCard() {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [isForging, setIsForging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forgeCard = async ({
    name,
    element,
    imageUrl,
  }: ForgeCardParams): Promise<void> => {
    if (!currentAccount) {
      throw new Error("Wallet not connected");
    }

    setIsForging(true);
    setError(null);

    try {
      const tx = new Transaction();

      // Call the forge_card_entry function from the smart contract
      tx.moveCall({
        target: `${PACKAGE_ID}::ai_forge::forge_card_entry`,
        arguments: [
          tx.pure.string(name),
          tx.pure.string(element),
          tx.pure.string(imageUrl),
          tx.object(RANDOM_OBJECT_ID), // Random object for VRF
        ],
      });

      return new Promise((resolve, reject) => {
        signAndExecute(
          {
            transaction: tx,
          },
          {
            onSuccess: (result) => {
              console.log("Card forged successfully:", result);
              setIsForging(false);
              resolve();
            },
            onError: (err) => {
              console.error("Error forging card:", err);
              setError(err.message);
              setIsForging(false);
              reject(err);
            },
          },
        );
      });
    } catch (err: any) {
      setError(err.message);
      setIsForging(false);
      throw err;
    }
  };

  return {
    forgeCard,
    isForging,
    error,
  };
}
