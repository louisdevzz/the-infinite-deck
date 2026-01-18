// Walrus aggregator URL for testnet
export const WALRUS_AGGREGATOR =
  "https://aggregator.walrus-testnet.walrus.space";

/**
 * Get the Walrus URL for a blob ID
 */
export function getWalrusUrl(blobId: string): string {
  return `${WALRUS_AGGREGATOR}/v1/blobs/${blobId}`;
}

/**
 * Fetch image from Walrus and convert to base64 data URL
 * This is useful for displaying images in <img> tags
 */
export async function fetchWalrusImageAsBase64(
  blobId: string,
): Promise<string> {
  try {
    const url = getWalrusUrl(blobId);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch blob: ${response.statusText}`);
    }

    const blob = await response.blob();

    // Convert blob to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert blob to base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error fetching Walrus image:", error);
    throw error;
  }
}

/**
 * Extract blob ID from Walrus URL
 */
export function extractBlobIdFromUrl(walrusUrl: string): string | null {
  const match = walrusUrl.match(/\/v1\/blobs\/([^/?]+)/);
  return match ? match[1] : null;
}

/**
 * Check if a URL is a Walrus URL
 */
export function isWalrusUrl(url: string): boolean {
  return url.includes("walrus") && url.includes("/v1/blobs/");
}
