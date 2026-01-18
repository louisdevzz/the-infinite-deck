import { GoogleGenAI } from "@google/genai";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { decodeSuiPrivateKey } from "@mysten/sui.js/cryptography";
import * as dotenv from "dotenv";

dotenv.config();

interface CardMetadata {
  name: string;
  element: string;
}

async function generateCardMetadata(prompt: string): Promise<CardMetadata> {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!
  });

  console.log("🤖 Generating card metadata with AI...");

  const metadataPrompt = `Based on this card description: "${prompt}"

Generate card metadata following these rules:

1. NAME: Create a creative fantasy card name (2-4 words)
   - Must be epic and memorable
   - Examples: "Thunder Dragon Emperor", "Flame Spirit Warrior", "Crystal Ice Phoenix"

2. ELEMENT: Choose ONE element that best fits the description
   - Valid options: Fire, Water, Earth, Lightning, Dark, Light
   - Consider the theme and imagery of the prompt

Respond ONLY with valid JSON in this exact format:
{"name": "Card Name Here", "element": "ElementName"}

No additional text, just the JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ text: metadataPrompt }]
    });

    const text = response.candidates[0].content.parts[0].text!;
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[^}]+\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in AI response");
    }

    const metadata = JSON.parse(jsonMatch[0]) as CardMetadata;

    // Validate element
    const validElements = ["Fire", "Water", "Earth", "Lightning", "Dark", "Light"];
    if (!validElements.includes(metadata.element)) {
      console.warn(`⚠️  Invalid element "${metadata.element}", defaulting to "Light"`);
      metadata.element = "Light";
    }

    return metadata;
  } catch (error) {
    console.error("❌ Error generating metadata:", error);
    throw error;
  }
}

async function createCard(prompt: string) {
  const PACKAGE_ID = process.env.CARD_PACKAGE_ID;
  const PRIVATE_KEY = process.env.PRIVATE_KEY;

  if (!PACKAGE_ID) {
    throw new Error("CARD_PACKAGE_ID not set in .env");
  }

  if (!PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not set in .env");
  }

  // 1. Generate metadata
  const metadata = await generateCardMetadata(prompt);
  
  console.log("\n✨ Generated Metadata:");
  console.log(`📛 Name: ${metadata.name}`);
  console.log(`⚡ Element: ${metadata.element}\n`);

  // 2. Connect to Sui
  const client = new SuiClient({ url: getFullnodeUrl("testnet") });
  
  // 3. Setup keypair - Support both bech32 and hex formats
  let keypair: Ed25519Keypair;
  
  try {
    if (PRIVATE_KEY.startsWith('suiprivkey')) {
      // Bech32 format (suiprivkey...)
      console.log("🔑 Detected bech32 format private key");
      const decoded = decodeSuiPrivateKey(PRIVATE_KEY);
      
      if (decoded.schema !== 'ED25519') {
        throw new Error('Only ED25519 keys are supported');
      }
      
      keypair = Ed25519Keypair.fromSecretKey(decoded.secretKey);
    } else {
      // Hex format (0x... or without prefix)
      console.log("🔑 Detected hex format private key");
      const privateKeyHex = PRIVATE_KEY.replace('0x', '');
      const privateKeyBytes = Uint8Array.from(Buffer.from(privateKeyHex, 'hex'));
      keypair = Ed25519Keypair.fromSecretKey(privateKeyBytes);
    }
  } catch (error: any) {
    throw new Error(`Failed to parse private key: ${error.message}`);
  }

  const sender = keypair.getPublicKey().toSuiAddress();
  console.log(`👤 Sender: ${sender}`);

  // 4. Build transaction
  const tx = new TransactionBlock();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::card::create_card`,
    arguments: [
      tx.object("0x8"), // Random object
      tx.pure(prompt, "string"),
      tx.pure(metadata.name, "string"),
      tx.pure(metadata.element, "string")
    ]
  });

  tx.setGasBudget(10000000);

  // 5. Execute transaction
  console.log("📤 Sending transaction...\n");
  
  try {
    const result = await client.signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: tx,
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: true
      }
    });

    console.log("✅ Transaction successful!");
    console.log(`🔗 Digest: ${result.digest}`);
    
    // Find created card object
    if (result.objectChanges) {
      for (const change of result.objectChanges) {
        if (change.type === "created" && change.objectType?.includes("::card::Card")) {
          console.log(`🎴 Card ID: ${change.objectId}`);
        }
      }
    }

    // Show events
    if (result.events && result.events.length > 0) {
      console.log("\n📡 Events:");
      for (const event of result.events) {
        if (event.type.includes("CardCreated")) {
          console.log(JSON.stringify(event.parsedJson, null, 2));
        }
      }
    }

    console.log("\n🎉 Card created! The cardProcessor will now generate the image.");
    
  } catch (error: any) {
    console.error("❌ Transaction failed:", error.message);
    throw error;
  }
}

// Main function
async function main() {
  const prompt = process.argv[2];

  if (!prompt) {
    console.log("Usage: npx tsx src/createCard.ts \"your card description\"");
    console.log("\nExamples:");
    console.log('  npx tsx src/createCard.ts "thunder dragon emperor"');
    console.log('  npx tsx src/createCard.ts "fire phoenix warrior"');
    console.log('  npx tsx src/createCard.ts "ice crystal mage"');
    process.exit(1);
  }

  console.log("🎴 ===== CARD CREATION =====");
  console.log(`📝 Prompt: "${prompt}"\n`);

  try {
    await createCard(prompt);
  } catch (error) {
    console.error("\n💥 Failed to create card:", error);
    process.exit(1);
  }
}

main();
