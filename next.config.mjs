/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable source maps in production for smaller builds and better security
  productionBrowserSourceMaps: false,

  images: {
    // Allow optimized images from trusted remote sources
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.elferspot.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
