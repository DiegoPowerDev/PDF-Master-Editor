import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: ["@adobe/pdfservices-node-sdk"],
  typescript: {
    ignoreBuildErrors: false, //esto es para ignorar los errores de typeScript durante el build
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
