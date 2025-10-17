import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'i.postimg.cc'],
  },
  serverExternalPackages: ['@auth0/nextjs-auth0'],
};

export default nextConfig;
