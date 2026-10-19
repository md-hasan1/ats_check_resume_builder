import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

interface StorageResult {
  url: string;
  key: string;
}

/**
 * Storage abstraction — defaults to local filesystem for development.
 * In production, swap to S3/Supabase/Cloudinary by changing the provider.
 */
class StorageService {
  private provider: string;

  constructor() {
    this.provider = process.env.STORAGE_PROVIDER || "local";
  }

  async upload(
    file: Buffer,
    filename: string,
    contentType: string
  ): Promise<StorageResult> {
    switch (this.provider) {
      case "local":
        return this.uploadLocal(file, filename);
      default:
        return this.uploadLocal(file, filename);
    }
  }

  async delete(key: string): Promise<void> {
    switch (this.provider) {
      case "local":
        return this.deleteLocal(key);
      default:
        return this.deleteLocal(key);
    }
  }

  private async uploadLocal(
    file: Buffer,
    filename: string
  ): Promise<StorageResult> {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const uniqueName = `${Date.now()}-${filename}`;
    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, file);

    return {
      url: `/uploads/${uniqueName}`,
      key: uniqueName,
    };
  }

  private async deleteLocal(key: string): Promise<void> {
    const filePath = path.join(process.cwd(), "public", "uploads", key);
    try {
      await unlink(filePath);
    } catch {
      // File may already be deleted
    }
  }
}

export const storage = new StorageService();
