"use client";

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.75;

// Vercel Serverless Functions (Node runtime) enforce a hard, non-configurable
// ~4.5MB request body limit. Uncompressed photos straight off a modern phone
// camera (often 3-8MB each) blow through that in a single multi-image upload,
// failing with a generic error before our route handler even runs. Resizing
// and re-encoding client-side keeps uploads well under that limit regardless
// of source device, while staying plenty sharp for the site's display sizes.
export async function compressImage(file) {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);

    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    );

    if (!blob || blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^./\\]+$/, "") + ".jpg";
    return new File([blob], newName, {
      type: "image/jpeg",
      lastModified: file.lastModified,
    });
  } catch {
    // If decoding/compression fails for any reason, fall back to the
    // original file rather than blocking the upload entirely.
    return file;
  }
}

export async function compressImages(files) {
  return Promise.all(files.map(compressImage));
}
