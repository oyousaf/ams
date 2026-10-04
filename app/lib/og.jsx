import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Shared bits for the generated Open Graph images (app/**/opengraph-image.jsx).
// Satori (next/og) can't decode WebP, so photos are JPEG/PNG data URLs, and it
// only supports flexbox with explicit positioning (no `inset`).

export const OG_SIZE = { width: 1200, height: 630 };

// Each path is a literal so output tracing bundles just these files (a
// shared helper taking a path variable makes it trace the whole project).
// Read once per server instance.
const asDataUrl = async (file, mime) =>
  `data:${mime};base64,${(await file).toString("base64")}`;

const logoFile = asDataUrl(
  readFile(join(process.cwd(), "public/logo.png")),
  "image/png",
);
const heroFile = asDataUrl(
  readFile(join(process.cwd(), "assets/og-hero.jpg")),
  "image/jpeg",
);
const fontMedium = readFile(
  join(process.cwd(), "assets/fonts/Manrope-Medium.ttf"),
);
const fontExtraBold = readFile(
  join(process.cwd(), "assets/fonts/Manrope-ExtraBold.ttf"),
);

export const loadLogo = () => logoFile;
export const loadHeroPhoto = () => heroFile;

// ImageResponse options: size + the site's own font (Manrope, OFL licensed).
export async function ogOptions() {
  return {
    ...OG_SIZE,
    fonts: [
      { name: "Manrope", data: await fontMedium, weight: 500, style: "normal" },
      { name: "Manrope", data: await fontExtraBold, weight: 800, style: "normal" },
    ],
  };
}

// Fetches a remote listing photo and re-encodes it as JPEG (listing photos
// are often WebP). Returns null on any failure so the card still renders.
export async function remotePhotoDataUrl(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const input = Buffer.from(await res.arrayBuffer());
    const { default: sharp } = await import("sharp");
    const jpeg = await sharp(input)
      .resize(OG_SIZE.width, OG_SIZE.height, { fit: "cover" })
      .jpeg({ quality: 80 })
      .toBuffer();
    return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch {
    return null;
  }
}

const fill = {
  position: "absolute",
  top: 0,
  left: 0,
  width: OG_SIZE.width,
  height: OG_SIZE.height,
};

// Photo background + rose scrim + logo/footer chrome shared by every card.
// `children` is stacked in a column between the logo and the footer.
export function OgFrame({ photo, logo, children, footer }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: "#4c0519",
        color: "white",
        fontFamily: "Manrope",
        fontWeight: 500,
      }}
    >
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        <img src={photo} style={{ ...fill, objectFit: "cover" }} />
      )}

      <div
        style={{
          ...fill,
          display: "flex",
          backgroundImage:
            "linear-gradient(90deg, rgba(76,5,25,0.97) 0%, rgba(76,5,25,0.9) 45%, rgba(76,5,25,0.35) 72%, rgba(76,5,25,0) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 740,
          height: "100%",
          padding: "52px 64px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={logo} width={238} height={73} style={{ borderRadius: 12 }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {children}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 24,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          {footer.map((item, i) => (
            <div key={item} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && (
                <span style={{ color: "#fda4af", margin: "0 14px" }}>•</span>
              )}
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Pill({ children }) {
  return (
    <div
      style={{
        display: "flex",
        marginBottom: 24,
        padding: "8px 22px",
        borderRadius: 999,
        backgroundColor: "rgba(253,164,175,0.18)",
        border: "1px solid rgba(253,164,175,0.5)",
        color: "#fecdd3",
        fontSize: 26,
        fontWeight: 800,
      }}
    >
      {children}
    </div>
  );
}

export function Headline({ children, size = 68, uppercase = false }) {
  return (
    <div
      style={{
        display: "flex",
        fontSize: size,
        fontWeight: 800,
        lineHeight: 1.05,
        letterSpacing: "-0.02em",
        textTransform: uppercase ? "uppercase" : "none",
      }}
    >
      {children}
    </div>
  );
}

export function Subline({ children }) {
  return (
    <div
      style={{
        display: "flex",
        marginTop: 20,
        fontSize: 28,
        color: "rgba(255,255,255,0.88)",
      }}
    >
      {children}
    </div>
  );
}
