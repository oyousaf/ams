/** @type {import('next').NextConfig} */

// Baseline hardening headers. A full Content-Security-Policy is deliberately
// left out for now: it needs nonces for Next's inline scripts plus allowances
// for EmailJS, Vercel Analytics and the Google Maps embed, and should be
// rolled out in report-only mode first.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

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

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
