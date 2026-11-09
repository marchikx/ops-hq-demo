import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isPages = process.env.GITHUB_PAGES === "true";
const cryptoShim = path.join(__dirname, "lib", "browser-crypto.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      const webpack = require("webpack");
      config.resolve.alias = {
        ...config.resolve.alias,
        crypto: cryptoShim,
      };
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: cryptoShim,
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer/"),
        process: require.resolve("process/browser"),
        path: false,
        fs: false,
        net: false,
        tls: false,
      };
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
          resource.request = resource.request.replace(/^node:/, "");
        }),
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: ["process"],
        }),
      );
    }
    return config;
  },
  ...(isPages && {
    output: "export",
    basePath: "/ops-hq-demo",
    trailingSlash: true,
    images: { unoptimized: true },
  }),
};

export default nextConfig;
