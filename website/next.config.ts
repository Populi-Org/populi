import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.impresa.pt",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "imagens.publico.pt",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
