import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Admin poster uploads exceed the 1 MB default server action limit.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
