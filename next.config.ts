import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: ["@adobe/pdfservices-node-sdk"],
};

export default nextConfig;
