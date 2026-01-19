import React, { useState, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useForgeCard } from "../../../hooks/useForgeCard";
import { BACKEND_URL } from "../../../constants";
import { CyberCard, ElementType, RarityType } from "../../../data/mockData";
import {
  extractBlobIdFromUrl,
  fetchWalrusImageAsBase64,
} from "../../../utils/walrus";

interface ForgeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onForgeComplete: (card: CyberCard) => void;
}

type ForgeStatus =
  | "IDLE"
  | "GENERATING_METADATA"
  | "GENERATING_IMAGE"
  | "UPLOADING"
  | "MINTING"
  | "COMPLETE"
  | "ERROR";

interface CardMetadata {
  name: string;
  element: string;
}

export const ForgeDialog: React.FC<ForgeDialogProps> = ({
  isOpen,
  onClose,
  onForgeComplete,
}) => {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<ForgeStatus>("IDLE");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<CardMetadata | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [blobId, setBlobId] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const currentAccount = useCurrentAccount();
  const { forgeCard, isForging } = useForgeCard();

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setStatus("IDLE");
      setPrompt("");
      setProgress(0);
      setError(null);
      setMetadata(null);
      setImageUrl(null);
      setBlobId(null);
      setBase64Image(null);
    }
  }, [isOpen]);

  const handleForge = async () => {
    if (!prompt.trim()) return;
    if (!currentAccount) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      // Step 1: Generate metadata
      setStatus("GENERATING_METADATA");
      setProgress(20);

      const metadataResponse = await fetch(
        `${BACKEND_URL}/api/generate-metadata`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        },
      );

      if (!metadataResponse.ok) {
        throw new Error("Failed to generate metadata");
      }

      const metadataData = await metadataResponse.json();
      const cardMetadata: CardMetadata = metadataData.metadata;
      setMetadata(cardMetadata);
      setProgress(40);

      // Step 2: Generate image
      setStatus("GENERATING_IMAGE");

      const imageResponse = await fetch(`${BACKEND_URL}/api/generate-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cardMetadata.name,
          element: cardMetadata.element,
          description: prompt,
        }),
      });

      if (!imageResponse.ok) {
        throw new Error("Failed to generate image");
      }

      const imageData = await imageResponse.json();
      const generatedImageUrl = imageData.imageUrl;
      setImageUrl(generatedImageUrl);
      setProgress(60);

      // Step 3: Upload to Walrus
      setStatus("UPLOADING");

      const uploadResponse = await fetch(
        `${BACKEND_URL}/api/upload-to-walrus`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: generatedImageUrl,
            imageName: `${cardMetadata.name}.png`,
          }),
        },
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload to Walrus");
      }

      const uploadData = await uploadResponse.json();
      const walrusUrl = uploadData.walrusUrl;
      const uploadedBlobId = uploadData.blobId;

      // Extract blob ID and fetch the image as base64
      const extractedBlobId = extractBlobIdFromUrl(walrusUrl) || uploadedBlobId;
      setBlobId(extractedBlobId);

      // Fetch the image from Walrus and convert to base64
      if (extractedBlobId && !extractedBlobId.startsWith("placeholder")) {
        try {
          const base64 = await fetchWalrusImageAsBase64(extractedBlobId);
          setBase64Image(base64);
        } catch (err) {
          console.warn(
            "Failed to fetch Walrus image, using original URL:",
            err,
          );
          setBase64Image(walrusUrl); // Fallback to original URL
        }
      } else {
        setBase64Image(walrusUrl); // Use placeholder URL
      }

      setProgress(80);

      // Step 4: Mint NFT on blockchain
      setStatus("MINTING");

      await forgeCard({
        name: cardMetadata.name,
        element: cardMetadata.element,
        imageUrl: walrusUrl,
      });

      setProgress(100);
      setStatus("COMPLETE");

      // Create a mock card object for the UI
      const newCard: CyberCard = {
        id: `FORGED-${Date.now()}`,
        name: cardMetadata.name,
        title: cardMetadata.name,
        type: "Construct",
        rarity: "Legendary" as RarityType,
        element: cardMetadata.element as ElementType,
        image: base64Image || walrusUrl, // Use base64 if available
        img: base64Image || walrusUrl,
        description: prompt,
        price: 0,
        status: "READY",
        hp: 5000,
        atk: 5000,
        def: 5000,
        stats: {
          power: 100,
          integrity: 10000,
          stability: "1000 T/s",
        },
        metadata: {
          origin: "AI_FORGE",
          weaponry: "N/A",
        },
      };

      // Pass back the new card after a brief delay
      setTimeout(() => {
        onForgeComplete(newCard);
      }, 500);
    } catch (err: any) {
      console.error("Forge error:", err);
      setError(err.message || "An error occurred during forging");
      setStatus("ERROR");
    }
  };

  if (!isOpen) return null;

  const getStatusMessage = () => {
    switch (status) {
      case "GENERATING_METADATA":
        return "ANALYZING NEURAL PATTERNS...";
      case "GENERATING_IMAGE":
        return "SYNTHESIZING VISUAL MATRIX...";
      case "UPLOADING":
        return "UPLOADING TO DECENTRALIZED STORAGE...";
      case "MINTING":
        return "MINTING ON BLOCKCHAIN...";
      case "COMPLETE":
        return "CONSTRUCTION COMPLETE";
      case "ERROR":
        return "ERROR DETECTED";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center backdrop-blur-sm">
      <div className="w-full max-w-3xl min-h-[600px] bg-black/90 border border-primary/30 rounded-xl p-12 relative shadow-[0_0_50px_rgba(0,229,255,0.2)] overflow-hidden flex flex-col justify-center">
        {/* Close Button */}
        <div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          {/* Header */}
          <div className="absolute top-4 left-4 flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-3xl text-primary animate-pulse">
              rocket_launch
            </span>
            <div>
              <h2 className="text-xl font-black uppercase tracking-widest text-white">
                Neural Forge
              </h2>
              <div className="h-0.5 w-full bg-linear-to-r from-primary/50 to-transparent mt-1"></div>
            </div>
          </div>
        </div>

        {/* Content based on status */}
        {status === "IDLE" && (
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-primary/60 mb-2">
                Construction Parameters
              </label>
              <div className="bg-transparent rounded-lg p-4 border border-primary/30 focus-within:border-primary/80 transition-colors">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the entity you wish to synthesize..."
                  className="w-full h-64 bg-transparent border-none appearance-none outline-none focus:outline-none focus:ring-0 text-lg font-mono text-white resize-none placeholder:text-white/20"
                />
              </div>
            </div>
            <button
              onClick={handleForge}
              disabled={!prompt.trim() || !currentAccount}
              className="w-full py-4 bg-primary text-background-dark font-black tracking-[0.2em] uppercase rounded hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">bolt</span>
                {currentAccount ? "Initialize Forge" : "Connect Wallet First"}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            </button>
          </div>
        )}

        {(status === "GENERATING_METADATA" ||
          status === "GENERATING_IMAGE" ||
          status === "UPLOADING" ||
          status === "MINTING") && (
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <div className="relative size-32">
              <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black text-primary">
                  {progress}%
                </span>
              </div>
            </div>
            <p className="text-primary/80 font-mono animate-pulse tracking-widest">
              {getStatusMessage()}
            </p>

            {/* Terminal output effect */}
            <div className="w-full h-24 bg-black/50 rounded border border-white/5 p-2 font-mono text-[10px] text-green-500 overflow-hidden flex flex-col-reverse">
              {metadata && (
                <div className="opacity-70">
                  &gt; Metadata: {metadata.name} ({metadata.element})
                </div>
              )}
              {imageUrl && (
                <div className="opacity-70">&gt; Image generated</div>
              )}
              <div className="opacity-50">
                &gt; Initializing forge sequence...
              </div>
            </div>
          </div>
        )}

        {status === "COMPLETE" && (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="material-symbols-outlined text-6xl text-primary mb-4 animate-[bounce_0.5s_ease-out]">
              check_circle
            </span>
            <h3 className="text-2xl font-black text-white uppercase tracking-widest">
              Construction Complete
            </h3>
            {metadata && (
              <p className="text-primary/60 mt-2">
                {metadata.name} - {metadata.element}
              </p>
            )}
          </div>
        )}

        {status === "ERROR" && (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="material-symbols-outlined text-6xl text-red-500 mb-4">
              error
            </span>
            <h3 className="text-2xl font-black text-white uppercase tracking-widest">
              Error
            </h3>
            <p className="text-red-400 mt-2 text-center">{error}</p>
            <button
              onClick={() => setStatus("IDLE")}
              className="mt-6 px-6 py-2 bg-primary text-background-dark font-bold rounded hover:brightness-110"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
