import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
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

// Walrus Configuration
const PUBLISHER_URL =
  process.env.WALRUS_PUBLISHER_URL ||
  "https://publisher.walrus-testnet.walrus.space";
const AGGREGATOR_URL =
  process.env.WALRUS_AGGREGATOR_URL ||
  "https://aggregator.walrus-testnet.walrus.space";

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

    console.log(`📤 Uploading to Walrus: ${imageName || "image"}`);

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBlob = new Uint8Array(imageBuffer);

    console.log(`📦 Image size: ${imageBlob.length} bytes`);

    const maxRetries = 5;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Upload attempt ${attempt}/${maxRetries}...`);

        // Send PUT request to Walrus Publisher
        console.log(`📡 PUT ${PUBLISHER_URL}/v1/blobs?epochs=5`);
        const response = await fetch(`${PUBLISHER_URL}/v1/blobs?epochs=5`, {
          method: "PUT",
          body: imageBlob,
        });

        if (response.status === 200) {
          const info: any = await response.json();
          console.log(`✅ Uploaded to Walrus!`, info);

          let blobId;
          let objectId; // This is the Sui Object ID (if newly created) or transaction digest (if already certified)

          if ("newlyCreated" in info) {
            blobId = info.newlyCreated.blobObject.blobId;
            objectId = info.newlyCreated.blobObject.id;
          } else if ("alreadyCertified" in info) {
            blobId = info.alreadyCertified.blobId;
            objectId = info.alreadyCertified.event.txDigest; // Or similar ID, keeping consistent with request
          } else {
            throw new Error("Unhandled successful response format from Walrus");
          }

          console.log(`📦 Blob ID: ${blobId}`);

          const walrusUrl = `${AGGREGATOR_URL}/v1/blobs/${blobId}`;

          return res.json({
            success: true,
            walrusUrl,
            blobId,
            objectId,
            note: "Image uploaded to Walrus decentralized storage (HTTP API)",
          });
        } else {
          const errorText = await response.text();
          throw new Error(`Walrus HTTP Error ${response.status}: ${errorText}`);
        }
      } catch (error: any) {
        lastError = error;
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
  console.log(`🌊 Walrus API: Using HTTP API at ${PUBLISHER_URL}`);
});
