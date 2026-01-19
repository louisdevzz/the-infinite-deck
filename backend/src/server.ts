import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { walrus, RetryableWalrusClientError } from "@mysten/walrus";

import * as fs from "fs";
import * as path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const walrusClient = new SuiClient({
  url: getFullnodeUrl("testnet"),
  network: "testnet",
} as any).$extend(walrus());

const RARITY_NAMES = ["Common", "Uncommon", "Epic", "Legendary"];

const REFERENCE_IMAGE = "reference.jpg";

const ELEMENT_STYLES: Record<string, string> = {
  Fire: "surrounded by flames and embers, warm orange and red tones, fiery atmosphere",
  Water:
    "surrounded by flowing water and bubbles, cool blue tones, aquatic atmosphere",
  Earth:
    "surrounded by rocks and nature, green and brown tones, natural atmosphere",
  Lightning:
    "surrounded by electric sparks and lightning bolts, bright yellow and purple tones, electric atmosphere",
  Dark: "surrounded by shadows and dark energy, deep purple and black tones, mysterious atmosphere",
  Light:
    "surrounded by radiant light and sparkles, bright white and golden tones, divine atmosphere",
};

// Initialize keypair
let walrusKeypair: Ed25519Keypair | null = null;
if (process.env.SUI_PRIVATE_KEY) {
  try {
    const privateKey = process.env.SUI_PRIVATE_KEY;
    if (privateKey.startsWith("suiprivkey")) {
      const decoded = decodeSuiPrivateKey(privateKey);
      walrusKeypair = Ed25519Keypair.fromSecretKey(decoded.secretKey);
    } else {
      const privateKeyHex = privateKey.replace("0x", "");
      const privateKeyBytes = Uint8Array.from(
        Buffer.from(privateKeyHex, "hex"),
      );
      walrusKeypair = Ed25519Keypair.fromSecretKey(privateKeyBytes);
    }
    console.log("✓ Walrus keypair initialized");
  } catch (error) {
    console.warn("⚠ Failed to initialize Walrus keypair:", error);
  }
}

console.log("🖼️  Checking reference images...");
const referencesDir = path.join(process.cwd(), "references");
if (!fs.existsSync(referencesDir)) {
  console.warn("⚠️  Creating references/ folder...");
  fs.mkdirSync(referencesDir, { recursive: true });
}

const refPath = path.join(referencesDir, REFERENCE_IMAGE);
if (fs.existsSync(refPath)) {
  console.log(`  ✅ Reference image found: ${REFERENCE_IMAGE}`);
} else {
  console.log(`  ⚠️  Reference image missing: ${REFERENCE_IMAGE}`);
}
console.log("");

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/generate-metadata", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

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

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(metadataPrompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[^}]+\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from Gemini response");
    }

    const metadata = JSON.parse(jsonMatch[0]);

    res.json({
      success: true,
      metadata: {
        name: metadata.name,
        element: metadata.element,
      },
    });
  } catch (error: any) {
    console.error("Error generating metadata:", error);
    res.status(500).json({
      error: "Failed to generate metadata",
      details: error.message,
    });
  }
});

app.post("/api/generate-image", async (req: Request, res: Response) => {
  try {
    const { name, element, description, rarity = 0 } = req.body;

    if (!name || !element) {
      return res.status(400).json({ error: "Name and element are required" });
    }

    console.log(
      `🎨 Generating ${RARITY_NAMES[rarity]} card: "${name}" (${element})`,
    );

    const elementStyle =
      ELEMENT_STYLES[element] || "mystical energy surrounding";

    let referenceBase64: string | null = null;
    const referenceFilename = REFERENCE_IMAGE;
    const referencePath = path.join(
      process.cwd(),
      "references",
      referenceFilename,
    );

    if (fs.existsSync(referencePath)) {
      const referenceBuffer = fs.readFileSync(referencePath);
      referenceBase64 = referenceBuffer.toString("base64");
      console.log(`🖼️  Using reference: ${referenceFilename}`);
    } else {
      console.warn(`⚠️  Reference image not found: ${referencePath}`);
    }

    const imagePrompt = `Create a high-quality fantasy character illustration for a trading card game.

${referenceBase64 ? "REFERENCE IMAGE: Study the art style, quality, and atmosphere from the reference image. Learn from its composition, lighting, and detail level. But DO NOT copy any frames, borders, text, or UI elements." : ""}

CHARACTER: ${name} - ${description || "A powerful mystical entity"}

STYLE REQUIREMENTS:
- Epic fantasy art style, detailed and vibrant
- ${elementStyle}
- ${RARITY_NAMES[rarity]} quality: ${rarity === 3 ? "extremely detailed, masterpiece quality" : rarity === 2 ? "high detail, premium quality" : rarity === 1 ? "good detail, quality artwork" : "standard fantasy art"}
- Dynamic pose showing power and personality
- Cosmic/magical background with stars and energy swirls
- Full body or upper body portrait
- Professional trading card game artwork quality
- Match the artistic quality and atmosphere from the reference

DO NOT INCLUDE:
- No text, numbers, or card stats
- No borders or frames
- No card template elements
- No blank or white parts on image
- Just the pure character artwork

Focus on creating beautiful, powerful character art with ${element} theme that matches the reference's quality and style.`;

    console.log("🎨 Generating character artwork with reference...");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

    const parts: any[] = [imagePrompt];

    if (referenceBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: referenceBase64,
        },
      });
    }

    const result = await model.generateContent(parts);
    const response = await result.response;

    let imageBase64: string | null = null;

    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if ((part as any).inlineData) {
          imageBase64 = (part as any).inlineData.data;
          console.log(`✅ Image generated successfully`);
          break;
        }
      }
      if (imageBase64) break;
    }

    if (!imageBase64) {
      throw new Error("No image data returned from Gemini");
    }

    const imageUrl = `data:image/png;base64,${imageBase64}`;

    res.json({
      success: true,
      imageUrl,
      rarity: RARITY_NAMES[rarity],
      usedReference: !!referenceBase64,
      note: "Image generated with style reference from local reference images",
    });
  } catch (error: any) {
    console.error("Error generating image:", error);
    res.status(500).json({
      error: "Failed to generate image",
      details: error.message,
    });
  }
});

app.post("/api/upload-to-walrus", async (req: Request, res: Response) => {
  try {
    const { imageUrl, imageName } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    if (!walrusKeypair) {
      console.warn("⚠ No Walrus keypair configured, using placeholder");
      return res.json({
        success: true,
        walrusUrl: imageUrl,
        blobId: `placeholder_${Date.now()}`,
        note: "Walrus keypair not configured. Set SUI_PRIVATE_KEY in .env to enable real uploads.",
      });
    }

    console.log(`📤 Uploading to Walrus: ${imageName || "image"}`);

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBlob = new Uint8Array(imageBuffer);

    console.log(`📦 Image size: ${imageBlob.length} bytes`);

    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Upload attempt ${attempt}/${maxRetries}...`);

        const { blobId, blobObject } = await walrusClient.walrus.writeBlob({
          blob: imageBlob,
          deletable: false,
          epochs: 5,
          signer: walrusKeypair,
        });

        console.log(`✅ Uploaded to Walrus!`);
        console.log(`📦 Blob ID: ${blobId}`);
        console.log(`📦 Blob Object ID: ${blobObject.id.id}`);

        const walrusUrl = `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${blobId}`;

        return res.json({
          success: true,
          walrusUrl,
          blobId,
          objectId: blobObject.id.id,
          note: "Image uploaded to Walrus decentralized storage",
        });
      } catch (error: any) {
        lastError = error;

        if (error instanceof RetryableWalrusClientError) {
          console.warn(
            `⚠️ Retryable error on attempt ${attempt}/${maxRetries}. Resetting client...`,
          );
          walrusClient.walrus.reset();

          if (attempt < maxRetries) {
            const waitTime = attempt * 5000;
            console.log(`⏳ Retrying in ${waitTime / 1000}s...`);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            continue;
          }
        }

        console.error(
          `❌ Upload attempt ${attempt}/${maxRetries} failed:`,
          error.message,
        );

        if (attempt >= maxRetries) {
          break;
        }

        const waitTime = attempt * 5000;
        console.log(`⏳ Retrying in ${waitTime / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    throw new Error(
      `Failed to upload to Walrus after ${maxRetries} attempts: ${lastError?.message}`,
    );
  } catch (error: any) {
    console.error("Error uploading to Walrus:", error);
    res.status(500).json({
      error: "Failed to upload to Walrus",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(
    `📡 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`,
  );
  console.log(
    `🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? "✓ Set" : "✗ Not set"}`,
  );
  console.log(
    `🌊 Walrus Keypair: ${walrusKeypair ? "✓ Configured" : "✗ Not configured"}`,
  );
});
