export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/dashboard",
    },
    sitemap: "https://acemotorsales.uk/sitemap.xml",
    host: "https://acemotorsales.uk",
  };
}
