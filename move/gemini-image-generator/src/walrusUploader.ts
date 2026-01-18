import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { WalrusClient, RetryableWalrusClientError } from '@mysten/walrus';
import { readFileSync } from 'fs';
import * as dotenv from "dotenv";

dotenv.config();

export class WalrusUploader {
  private suiClient: SuiClient;
  private walrusClient: WalrusClient;
  private keypair: Ed25519Keypair;

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
      url: getFullnodeUrl('testnet')
    });

    // Initialize Walrus Client
    this.walrusClient = new WalrusClient({
      network: 'testnet',
      suiClient: this.suiClient,
    });
  }

  async uploadImage(imagePath: string, maxRetries: number = 3): Promise<string> {
    console.log(`📤 Uploading to Walrus: ${imagePath}`);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Đọc file thành bytes
        const fileBytes = readFileSync(imagePath);

        // Upload lên Walrus
        const { blobId, blobObject } = await this.walrusClient.writeBlob({
          blob: fileBytes,
          deletable: false,  // permanent storage
          epochs: 5,         // lưu trữ 5 epochs
          signer: this.keypair,
        });

        console.log(`✅ Uploaded to Walrus!`);
        console.log(`📦 Blob ID: ${blobId}`);
        console.log(`📦 Blob Object ID: ${blobObject.id.id}`);

        return blobId;
      } catch (error: any) {
        // Xử lý lỗi có thể retry được
        if (error instanceof RetryableWalrusClientError) {
          console.warn(`⚠️ Retryable error on attempt ${attempt}/${maxRetries}. Resetting client...`);
          this.walrusClient.reset();
          
          if (attempt < maxRetries) {
            const waitTime = attempt * 5000;
            console.log(`⏳ Retrying in ${waitTime/1000}s...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
        }
        
        console.error(`❌ Upload attempt ${attempt}/${maxRetries} failed:`, error.message);
        
        if (attempt >= maxRetries) {
          throw error;
        }
        
        const waitTime = attempt * 5000;
        console.log(`⏳ Retrying in ${waitTime/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    throw new Error("Max retries reached");
  }

  async updateCardImageUrl(cardId: string, blobId: string): Promise<void> {
    console.log(`\n🔄 Updating card image URL onchain...`);
    
    const walrusUrl = this.getWalrusUrl(blobId);

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
