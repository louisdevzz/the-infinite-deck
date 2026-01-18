import { useState, useCallback } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { CyberCard } from "../data/mockData";

export function useCards() {
  const client = useSuiClient();
  const [cards, setCards] = useState<Record<string, CyberCard>>({});
  const [loading, setLoading] = useState(false);

  const fetchCards = useCallback(
    async (cardIds: string[]) => {
      if (cardIds.length === 0) return;

      // Filter out IDs we already have, unless we want to refresh
      const uniqueIds = Array.from(new Set(cardIds));

      setLoading(true);
      try {
        const objects = await client.multiGetObjects({
          ids: uniqueIds,
          options: { showContent: true, showDisplay: true },
        });

        const newCards: Record<string, CyberCard> = {};

        objects.forEach((obj) => {
          if (obj.data?.content?.dataType === "moveObject") {
            const fields = obj.data.content.fields as any;
            const id = obj.data.objectId;

            // Simple mapping of rarity number to string
            const rarityMap = [
              "Common",
              "Uncommon",
              "Epic",
              "Legendary",
              "Mythic",
            ];
            const rarityIdx = fields.rarity || 0;

            newCards[id] = {
              id: id,
              name: fields.name,
              title: fields.name,
              type: "Sui-Card",
              rarity: (rarityMap[rarityIdx] || "Common") as any,
              element: fields.element_name as any,
              description: `Power: ${fields.power_score}`,
              image: fields.image_url,
              img: fields.image_url,
              hp: Number(fields.hp),
              atk: Number(fields.atk),
              def: Number(fields.def),
              status: "READY",
              stats: {
                power: Number(fields.atk),
                integrity: Number(fields.hp),
              },
            };
          }
        });

        setCards((prev) => ({ ...prev, ...newCards }));
      } catch (e) {
        console.error("Error fetching cards", e);
      } finally {
        setLoading(false);
      }
    },
    [client],
  );

  return { cards, loading, fetchCards };
}
