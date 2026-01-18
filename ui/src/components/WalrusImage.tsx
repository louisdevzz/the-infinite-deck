import React, { useEffect, useState } from "react";
import {
  extractBlobIdFromUrl,
  fetchWalrusImageAsBase64,
  isWalrusUrl,
} from "../utils/walrus";

interface WalrusImageProps {
  src: string;
  alt?: string;
  className?: string;
  fallback?: string;
}

/**
 * Component to display images from Walrus storage
 * Automatically fetches and converts Walrus blob IDs to base64 for display
 */
export const WalrusImage: React.FC<WalrusImageProps> = ({
  src,
  alt = "Walrus image",
  className = "",
  fallback = "https://placehold.co/512x512/1a1a2e/00e5ff?text=Loading",
}) => {
  const [imageSrc, setImageSrc] = useState<string>(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      // If it's not a Walrus URL, use it directly
      if (!isWalrusUrl(src)) {
        setImageSrc(src);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Extract blob ID from URL
        const blobId = extractBlobIdFromUrl(src);

        if (!blobId || blobId.startsWith("placeholder")) {
          // Use original URL for placeholders
          setImageSrc(src);
          setIsLoading(false);
          return;
        }

        // Fetch the image as base64
        const base64 = await fetchWalrusImageAsBase64(blobId);
        setImageSrc(base64);
        setIsLoading(false);
      } catch (err: any) {
        console.error("Failed to load Walrus image:", err);
        setError(err.message);
        setImageSrc(src); // Fallback to original URL
        setIsLoading(false);
      }
    };

    loadImage();
  }, [src, fallback]);

  return (
    <div className={`relative ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover ${isLoading ? "opacity-50" : "opacity-100"} transition-opacity`}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-500/80 text-white text-xs p-1 text-center">
          Failed to load
        </div>
      )}
    </div>
  );
};
