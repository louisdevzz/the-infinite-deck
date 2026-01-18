import { GoogleGenAI } from "@google/genai";
import { SuiClient } from "@mysten/sui.js/client";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { WalrusUploader } from "./walrusUploader";

dotenv.config();

interface CardCreatedEvent {
  card_id: string;
  name: string;
  element: string;
  rarity: number;
  power_score: string;
  final_prompt: string;
}

interface CardStats {
  name: string;
  element: string;
  atk: string;
  def: string;
  hp: string;
  power_score: string;
  rarity: number;
}

const RARITY_NAMES = ["Common", "Uncommon", "Epic", "Legendary"];
const BORDER_COLORS = ["green", "blue", "purple", "gold"];
const TEMPLATE_FILES = [
  "common_example.png",
  "uncommon_example.png", 
  "epic_example.png",
  "legend_example.png"
];

const ELEMENT_ICONS: Record<string, string> = {
  "Fire": "🔥",
  "Water": "💧",
  "Earth": "🌍",
  "Lightning": "⚡",
  "Dark": "🌑",
  "Light": "✨"
};

const processedCards = new Set<string>();

async function getCardStats(client: SuiClient, cardId: string): Promise<CardStats | null> {
  try {
    const cardObject = await client.getObject({
      id: cardId,
      options: { showContent: true }
    });

    if (cardObject.data?.content?.dataType === "moveObject") {
      const fields = (cardObject.data.content as any).fields;
      return {
        name: fields.name,
        element: fields.element,
        atk: fields.atk,
        def: fields.def,
        hp: fields.hp,
        power_score: fields.power_score,
        rarity: fields.rarity
      };
    }
    return null;
  } catch (error) {
    console.error("❌ Error fetching card stats:", error);
    return null;
  }
}

async function generateCardImage(
  client: SuiClient,
  prompt: string,
  cardId: string,
  name: string,
  element: string,
  rarity: number,
  walrusUploader: WalrusUploader
): Promise<string> {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!
  });

  console.log(`🎨 Generating ${RARITY_NAMES[rarity]} card: "${name}" (${element})...`);

  // Lấy stats từ chain
  console.log("📊 Fetching card stats from chain...");
  const stats = await getCardStats(client, cardId);

  if (!stats) {
    console.error("❌ Could not fetch card stats");
    throw new Error("Failed to fetch card stats");
  }

  console.log(`📛 Name: ${stats.name}`);
  console.log(`${ELEMENT_ICONS[stats.element] || "🔮"} Element: ${stats.element}`);
  console.log(`⚔️  ATK: ${stats.atk}`);
  console.log(`🛡️  DEF: ${stats.def}`);
  console.log(`❤️  HP: ${stats.hp}`);

  const framePath = path.join(process.cwd(), "images", TEMPLATE_FILES[rarity]);

  try {
    if (!fs.existsSync(framePath)) {
      throw new Error(`Template not found: ${framePath}`);
    }

    const frameBuffer = fs.readFileSync(framePath);
    const frameBase64 = frameBuffer.toString("base64");

    console.log(`🖼️  Using template: ${TEMPLATE_FILES[rarity]}`);
    console.log("🎨 Generating card artwork...");

    const cardPrompt = `Create a fantasy trading card using the reference image as style guide.

REQUIREMENTS:
1. Copy the exact card layout, border (${BORDER_COLORS[rarity]} color), and frame design from reference
2. Draw the main character/creature: "${prompt}"
3. Maintain the same template structure and decorative elements
4. High quality fantasy trading card art style
5. No name on the card! please!

Create beautiful character artwork that matches the reference card style with ${element} theme.`;

    const contents = [
      { text: cardPrompt },
      {
        inlineData: {
          mimeType: "image/png",
          data: frameBase64
        }
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: contents,
      config: {
        responseModalities: ["TEXT", "IMAGE"]
      }
    });

    // Lấy ảnh từ response
    let imageBase64: string | null = null;
    for (const part of (response as any).candidates[0].content.parts) {
      if (part.inlineData || part.inline_data) {
        const imageData = part.inlineData || part.inline_data;
        imageBase64 = imageData.data;
        break;
      }
    }

    if (!imageBase64) {
      throw new Error("No image generated");
    }

    // Lưu file
    const outputDir = path.join(process.cwd(), "cards");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const safeName = name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    const filename = `${cardId.slice(0, 8)}_${safeName}_${element.toLowerCase()}_${RARITY_NAMES[rarity].toLowerCase()}.png`;
    const outputPath = path.join(outputDir, filename);

    const buffer = Buffer.from(imageBase64, "base64");
    fs.writeFileSync(outputPath, buffer);

    console.log(`✅ Image saved: ${outputPath}`);
    console.log(`🎴 ${name} | ${element} | ${RARITY_NAMES[rarity]} | ATK:${stats.atk} DEF:${stats.def} HP:${stats.hp}`);

    // Upload to Walrus and update card
    try {
      console.log("\n🐋 Uploading to Walrus...");
      const blobId = await walrusUploader.uploadImage(outputPath);
  
      console.log("🔗 Updating card onchain...");
      await walrusUploader.updateCardImageUrl(cardId, blobId);
  
      console.log("\n🎉 Card fully processed with Walrus storage!");
    } catch (error) {
      console.error("\n⚠️  Walrus upload failed (image saved locally):", error);
    }
    
    return outputPath;

  } catch (error) {
    console.error("❌ Error generating image:", error);
    throw error;
  }
}

async function pollForNewCards(
  client: SuiClient, 
  packageId: string, 
  walrusUploader: WalrusUploader
) {
  console.log("🔄 Polling for new card events (every 3 seconds)...\n");
  
  while (true) {
    try {
      const events = await client.queryEvents({
        query: {
          MoveEventType: `${packageId}::card::CardCreated`
        },
        limit: 10,
        order: "descending"
      });

      for (const event of events.data) {
        const eventId = `${event.id.txDigest}:${event.id.eventSeq}`;
        
        if (processedCards.has(eventId)) {
          continue;
        }
        
        processedCards.add(eventId);
        
        const data = event.parsedJson as CardCreatedEvent;
        
        console.log("\n🎴 ===== NEW CARD DETECTED =====");
        console.log(`Event ID: ${eventId}`);
        console.log(`Card ID: ${data.card_id}`);
        console.log(`📛 Name: ${data.name}`);
        console.log(`${ELEMENT_ICONS[data.element] || "🔮"} Element: ${data.element}`);
        console.log(`Rarity: ${RARITY_NAMES[data.rarity]} (${data.rarity})`);
        console.log(`Power Score: ${data.power_score}`);
        console.log(`Prompt: ${data.final_prompt}`);
        console.log("================================\n");
        
        try {
          await generateCardImage(
            client,
            data.final_prompt,
            data.card_id,
            data.name,
            data.element,
            data.rarity,
            walrusUploader
          );
          
          console.log("\n✨ Card processing completed!\n");
        } catch (error) {
          console.error("❌ Error processing card:", error);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      console.error("❌ Polling error:", error);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

async function main() {
  const PACKAGE_ID = process.env.CARD_PACKAGE_ID;
  
  if (!PACKAGE_ID) {
    console.error("❌ Please set CARD_PACKAGE_ID in .env");
    process.exit(1);
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ Please set GEMINI_API_KEY in .env");
    process.exit(1);
  }

  if (!process.env.PRIVATE_KEY) {
    console.error("❌ Please set PRIVATE_KEY in .env");
    process.exit(1);
  }

  console.log("🚀 Card Processor Started (Polling Mode)");
  console.log(`📦 Package: ${PACKAGE_ID}`);
  console.log(`🖼️  Templates: ${TEMPLATE_FILES.length} rarity styles loaded`);
  console.log("⚠️  Press Ctrl+C to stop\n");

  const client = new SuiClient({ url: "https://fullnode.testnet.sui.io:443" });
  
  console.log("🔌 Testing connection to Sui testnet...");
  try {
    const chainId = await client.getChainIdentifier();
    console.log(`✅ Connected to chain: ${chainId}\n`);
  } catch (error) {
    console.error("❌ Failed to connect:", error);
    process.exit(1);
  }

  console.log("🐋 Initializing Walrus uploader...");
  let walrusUploader: WalrusUploader;
  try {
    walrusUploader = new WalrusUploader();
    console.log("✅ Walrus uploader ready\n");
  } catch (error) {
    console.error("❌ Failed to initialize Walrus uploader:", error);
    process.exit(1);
  }

  console.log("🔍 Loading existing cards (to avoid reprocessing)...");
  try {
    const existingEvents = await client.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::card::CardCreated`
      },
      limit: 50,
      order: "descending"
    });

    for (const event of existingEvents.data) {
      const eventId = `${event.id.txDigest}:${event.id.eventSeq}`;
      processedCards.add(eventId);
    }
    
    console.log(`✅ Marked ${processedCards.size} existing cards as processed\n`);
  } catch (error) {
    console.warn("⚠️  Could not load existing events:", error);
  }

  console.log("🎯 Ready! Waiting for NEW cards...\n");

  await pollForNewCards(client, PACKAGE_ID, walrusUploader);
}

process.on('SIGINT', () => {
  console.log("\n\n👋 Shutting down gracefully...");
  process.exit(0);
});

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
