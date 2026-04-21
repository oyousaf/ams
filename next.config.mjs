/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,

  images: {
    qualities: [70, 75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.acemotorsales.uk",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
