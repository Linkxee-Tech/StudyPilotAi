/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/studypilot-uploads/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google account avatars
      },
    ],
  },

  // Low-bandwidth / accessibility requirement: keep JS bundles small
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
