/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  images: {
    domains: [
      "ev-database.org",
      "cloud.appwrite.io",
    ],
  },
};

export default nextConfig;
