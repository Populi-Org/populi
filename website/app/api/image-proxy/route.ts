import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { type NextRequest, NextResponse } from "next/server";

const CACHE_DIR = path.join(process.cwd(), "public", "deputies-cache");

const downloading = new Set<string>();

const allowedDomains = [
  "upload.wikimedia.org",
  "avatars.githubusercontent.com",
];

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing URL parameter", { status: 400 });
  }

  let hostname: string;
  try {
    const urlObj = new URL(url);
    hostname = urlObj.hostname;
  } catch {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  if (!allowedDomains.includes(hostname)) {
    return new NextResponse("Domain not allowed", { status: 403 });
  }

  const hash = createHash("sha256").update(url).digest("hex");
  const ext = path.extname(new URL(url).pathname) || ".jpg";
  const cacheFilename = `${hash}${ext}`;
  const cachePath = path.join(CACHE_DIR, cacheFilename);

  try {
    if (existsSync(cachePath)) {
      const file = await readFile(cachePath);
      return new NextResponse(file, {
        headers: {
          "Content-Type": getContentType(ext),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    if (downloading.has(hash)) {
      let attempts = 0;
      while (downloading.has(hash) && attempts < 50) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }

      if (existsSync(cachePath)) {
        const file = await readFile(cachePath);
        return new NextResponse(file, {
          headers: {
            "Content-Type": getContentType(ext),
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    }

    downloading.add(hash);

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Populi/1.0 (educational platform)",
        },
      });

      if (!response.ok) {
        return new NextResponse(`Failed to fetch image: ${response.status}`, {
          status: 502,
        });
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      await mkdir(CACHE_DIR, { recursive: true });
      await writeFile(cachePath, buffer);

      return new NextResponse(buffer, {
        headers: {
          "Content-Type":
            response.headers.get("content-type") || getContentType(ext),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } finally {
      downloading.delete(hash);
    }
  } catch (error) {
    console.error("[Image Proxy] Error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

function getContentType(ext: string): string {
  const types: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
  };
  return types[ext.toLowerCase()] || "image/jpeg";
}
