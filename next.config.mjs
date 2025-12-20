/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,

  images: {
    qualities: [75, 85],

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
