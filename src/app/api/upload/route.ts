import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import { put } from "@vercel/blob";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "กรุณาเข้าสู่ระบบก่อนอัปโหลดรูปภาพ" },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "ไม่พบไฟล์รูปภาพที่ต้องการอัปโหลด" },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "รองรับเฉพาะไฟล์รูปภาพประเภท JPEG, PNG และ WebP เท่านั้น" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "ขนาดไฟล์ต้องไม่เกิน 3 MB" },
        { status: 413 }
      );
    }

    // หากมีการตั้งค่า BLOB_READ_WRITE_TOKEN ให้ใช้ Vercel Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const ext = file.name.split(".").pop() || "jpg";
      const blobFileName = `lost-found/${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
      const blob = await put(blobFileName, file, { access: "public" });
      return NextResponse.json({ url: blob.url }, { status: 201 });
    }

    // หากไม่มี ให้จัดเก็บลงใน public/uploads สำหรับ local dev
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
    const filePath = path.join(uploadsDir, filename);

    await fs.writeFile(filePath, buffer);
    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({ url: publicUrl }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ" },
      { status: 500 }
    );
  }
}
