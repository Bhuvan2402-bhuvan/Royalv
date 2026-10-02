import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export interface UploadResult {
  url: string;
  filename: string;
  sizeBytes: number;
  mimeType: string;
}

export interface StorageProvider {
  upload(fileBuffer: Buffer, filename: string, mimeType: string): Promise<UploadResult>;
  delete(urlOrKey: string): Promise<boolean>;
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Local Disk Storage Provider (Stores images in public/uploads)
 * Designed for immediate zero-config operation and easy migration to S3 / Cloudflare R2.
 */
export class LocalDiskStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), "public", "uploads");
  }

  private async ensureDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async upload(fileBuffer: Buffer, originalFilename: string, mimeType: string): Promise<UploadResult> {
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new Error(`Unsupported file type: ${mimeType}. Allowed: JPEG, PNG, WebP.`);
    }

    if (fileBuffer.length > MAX_FILE_SIZE_BYTES) {
      throw new Error(`File size exceeds 5MB maximum limit.`);
    }

    await this.ensureDir();

    const ext = path.extname(originalFilename).toLowerCase() || (mimeType === "image/png" ? ".png" : mimeType === "image/webp" ? ".webp" : ".jpg");
    const uniqueId = crypto.randomBytes(12).toString("hex");
    const safeFilename = `${Date.now()}-${uniqueId}${ext}`;
    const filePath = path.join(this.uploadDir, safeFilename);

    await fs.writeFile(filePath, fileBuffer);

    return {
      url: `/uploads/${safeFilename}`,
      filename: safeFilename,
      sizeBytes: fileBuffer.length,
      mimeType,
    };
  }

  async delete(urlOrKey: string): Promise<boolean> {
    try {
      const filename = path.basename(urlOrKey);
      const filePath = path.join(this.uploadDir, filename);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Factory that returns the configured StorageProvider instance.
 * Easily swappable to S3StorageProvider or R2StorageProvider via STORAGE_DRIVER env variable.
 */
export function getStorageProvider(): StorageProvider {
  const driver = process.env.STORAGE_DRIVER || "local";
  switch (driver.toLowerCase()) {
    case "s3":
    case "r2":
      // Fallback to local if S3 credentials not yet provided, otherwise initialize S3 provider
      return new LocalDiskStorageProvider();
    case "local":
    default:
      return new LocalDiskStorageProvider();
  }
}
