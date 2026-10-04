export default function manifest() {
  return {
    name: "Ace Motor Sales",
    short_name: "AMS",
    description:
      "Quality used cars in Heckmondwike, West Yorkshire, with nationwide UK delivery.",
    start_url: "/",
    display: "browser",
    background_color: "#171717",
    theme_color: "#171717",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      // Logo kept inside the central safe zone so Android's circle/squircle
      // masks don't clip it.
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
