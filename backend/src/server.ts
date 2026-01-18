import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { WalrusClient, RetryableWalrusClientError } from "@mysten/walrus";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "https://73a3216e7a3b.ngrok-free.app",
    ],
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Initialize Sui Client
const suiClient = new SuiClient({
  url: getFullnodeUrl("testnet"),
});

// Initialize Walrus Client
const walrusClient = new WalrusClient({
  network: "testnet",
  suiClient: suiClient,
});

// Initialize keypair for Walrus uploads (if provided)
let walrusKeypair: Ed25519Keypair | null = null;
if (process.env.SUI_PRIVATE_KEY) {
  try {
    // Support both suiprivkey format and hex format
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

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Generate card metadata using Gemini
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

    // Parse JSON from response
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

// Generate card image using Gemini
app.post("/api/generate-image", async (req: Request, res: Response) => {
  try {
    const { name, element, description } = req.body;

    if (!name || !element) {
      return res.status(400).json({ error: "Name and element are required" });
    }

    console.log(`🎨 Generating image for: ${name} (${element})`);

    const imagePrompt = `Create a fantasy trading card illustration for "${name}", a ${element} element card.

Description: ${description || "A powerful mystical entity"}

Style requirements:
- Epic fantasy art style with vibrant colors matching the ${element} element
- Dramatic lighting and composition
- Suitable for a collectible card game
- High detail and quality
- Portrait orientation (vertical)
- No text, no card borders, just the character/creature artwork
- Professional digital art quality`;

    // Use Gemini 2.0 Flash Exp for image generation
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });
    const result = await model.generateContent([imagePrompt]);
    const response = await result.response;

    // Extract image from inline data
    let imageBase64: string | null = null;

    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        // Check if part has inlineData (image)
        if ((part as any).inlineData) {
          imageBase64 = (part as any).inlineData.data;
          console.log(
            `✅ Image generated successfully (${imageBase64.length} bytes)`,
          );
          break;
        }
      }
      if (imageBase64) break;
    }

    if (!imageBase64) {
      throw new Error("No image data returned from Gemini");
    }

    // Return base64 image as data URL
    const imageUrl = `data:image/png;base64,${imageBase64}`;

    res.json({
      success: true,
      imageUrl,
      prompt: imagePrompt,
      note: "Image generated by Gemini AI",
    });
  } catch (error: any) {
    console.error("Error generating image:", error);
    res.status(500).json({
      error: "Failed to generate image",
      details: error.message,
    });
  }
});

// Upload image to Walrus
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

    // Fetch the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBlob = new Uint8Array(imageBuffer);

    console.log(`📦 Image size: ${imageBlob.length} bytes`);

    // Upload to Walrus with retry logic
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Upload attempt ${attempt}/${maxRetries}...`);

        // Upload using Walrus SDK
        const { blobId, blobObject } = await walrusClient.writeBlob({
          blob: imageBlob,
          deletable: false, // permanent storage
          epochs: 5, // store for 5 epochs (~5 days on testnet)
          signer: walrusKeypair,
        });

        console.log(`✅ Uploaded to Walrus!`);
        console.log(`📦 Blob ID: ${blobId}`);
        console.log(`📦 Blob Object ID: ${blobObject.id.id}`);

        // Construct the Walrus URL - must include /blobs/ path
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

        // Handle retryable errors
        if (error instanceof RetryableWalrusClientError) {
          console.warn(
            `⚠️ Retryable error on attempt ${attempt}/${maxRetries}. Resetting client...`,
          );
          walrusClient.reset();

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

    // All retries failed
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(
    `📡 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`,
  );
  console.log(
    `🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? "✓ Set" : "✗ Not set"}`,
  );
  console.log(
    `🌊 Walrus Keypair: ${walrusKeypair ? "✓ Configured" : "✗ Not configured (uploads will use placeholder)"}`,
  );
});
