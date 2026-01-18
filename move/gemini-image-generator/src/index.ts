import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

async function generateImage(prompt: string, filename: string) {
  try {
    // Khởi tạo Google GenAI client
    const ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY 
    });

    console.log("🎨 Đang tạo ảnh...");

    // Gọi API Gemini để tạo ảnh
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [{ text: prompt }],
      config: {
        responseModalities: ['TEXT', 'IMAGE']
      }
    });

    // Tạo thư mục images nếu chưa có
    const outputDir = path.join(process.cwd(), "images");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, filename);
    let imageSaved = false;

    // Lưu ảnh từ response
    for (const part of response.candidates[0].content.parts) {
      // Kiểm tra text response (nếu có)
      if (part.text) {
        console.log("📝 Mô tả:", part.text);
      }
      
      // Lưu ảnh
      if (part.inlineData || part.inline_data) {
        const imageData = part.inlineData || part.inline_data;
        const buffer = Buffer.from(imageData.data, 'base64');
        fs.writeFileSync(outputPath, buffer);
        console.log(`✅ Ảnh đã lưu tại: ${outputPath}`);
        imageSaved = true;
      }
    }

    if (!imageSaved) {
      console.log("⚠️ Không tìm thấy ảnh trong response");
    }

    return outputPath;
  } catch (error) {
    console.error("❌ Lỗi khi tạo ảnh:", error);
    throw error;
  }
}

// Sử dụng với prompt tiếng Việt hoặc tiếng Anh
generateImage(
  "Create a beautiful landscape with mountains and sunset, vibrant colors",
  "landscape.png"
);
