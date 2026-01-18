import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { execFile } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

const execFileAsync = promisify(execFile);

export class WalrusUploader {
  private suiClient: SuiClient;
  private keypair: Ed25519Keypair;
  private walrusCliPath: string;

  constructor() {
    // Parse private key
    const privateKey = process.env.PRIVATE_KEY!;
    if (privateKey.startsWith('suiprivkey')) {
      const decoded = decodeSuiPrivateKey(privateKey);
      this.keypair = Ed25519Keypair.fromSecretKey(decoded.secretKey);
    } else {
      const privateKeyHex = privateKey.replace('0x', '');
      const privateKeyBytes = Uint8Array.from(Buffer.from(privateKeyHex, 'hex'));
      this.keypair = Ed25519Keypair.fromSecretKey(privateKeyBytes);
    }

    // Initialize Sui Client
    this.suiClient = new SuiClient({ 
      url: "https://sui-testnet-rpc.publicnode.com"
    });

    // Đường dẫn đến walrus.exe
    this.walrusCliPath = "C:\\walrus\\walrus.exe";
  }

  async uploadImage(imagePath: string, maxRetries: number = 3): Promise<string> {
    console.log(`📤 Uploading to Walrus: ${imagePath}`);

    if (!fs.existsSync(imagePath)) {
      throw new Error(`File not found: ${imagePath}`);
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { stdout, stderr } = await execFileAsync(
          this.walrusCliPath,
          ['store', '--epochs', '5', '--permanent', imagePath],
          { maxBuffer: 10 * 1024 * 1024 }
        );

        const blobIdMatch = stdout.match(/Blob ID:\s*([A-Za-z0-9_-]+)/i);
        
        if (!blobIdMatch || !blobIdMatch[1]) {
          console.error("❌ Could not parse Blob ID from output:");
          console.error(stdout);
          throw new Error("Failed to extract Blob ID from Walrus CLI output");
        }

        const blobId = blobIdMatch[1];
        console.log(`✅ Uploaded to Walrus!`);
        console.log(`📦 Blob ID: ${blobId}`);

        return blobId;
      } catch (error: any) {
        console.error(`❌ Upload attempt ${attempt}/${maxRetries} failed:`, error.message);
        
        if (error.stderr) {
          console.error(`CLI stderr: ${error.stderr}`);
        }
        
        if (attempt < maxRetries) {
          const waitTime = attempt * 5000;
          console.log(`⏳ Retrying in ${waitTime/1000}s...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else {
          throw error;
        }
      }
    }
    
    throw new Error("Max retries reached");
  }

  async updateCardImageUrl(cardId: string, blobId: string): Promise<void> {
    console.log(`\n🔄 Updating card image URL onchain...`);
    
    const walrusUrl = `https://aggregator.walrus-testnet.walrus.space/v1/${blobId}`;

    try {
      const tx = new Transaction();
      
      tx.moveCall({
        target: `${process.env.CARD_PACKAGE_ID}::card::update_image_url`,
        arguments: [
          tx.object(cardId),
          tx.pure.string(walrusUrl)
        ]
      });

      const result = await this.suiClient.signAndExecuteTransaction({
        transaction: tx,
        signer: this.keypair,
        options: {
          showEffects: true
        }
      });

      console.log(`✅ Card updated onchain!`);
      console.log(`🔗 Transaction: ${result.digest}`);
      console.log(`🖼️  Image URL: ${walrusUrl}`);
    } catch (error) {
      console.error("❌ Failed to update card:", error);
      throw error;
    }
  }

  getWalrusUrl(blobId: string): string {
    return `https://aggregator.walrus-testnet.walrus.space/v1/${blobId}`;
  }
}
