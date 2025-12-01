import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "casatextil.com.co",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    let baseUrl = apiUrl;
    if (apiUrl.endsWith("/api/v1")) {
      baseUrl = apiUrl.replace(/\/api\/v1$/, "");
    }
    return [
      {
        source: "/api/:path*",
        destination: `${baseUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
