import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getStorageProvider } from "@/lib/storage/storage-provider";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Authentication required" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const storage = getStorageProvider();

    const result = await storage.upload(buffer, file.name, file.type);

    return NextResponse.json({
      success: true,
      url: result.url,
      filename: result.filename,
      sizeBytes: result.sizeBytes,
    });
  } catch (error) {
    console.error("[Upload Error]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file." },
      { status: 400 }
    );
  }
}
