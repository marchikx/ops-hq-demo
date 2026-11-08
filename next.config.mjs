const isPages = process.env.GITHUB_PAGES === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(isPages && {
    output: "export",
    basePath: "/ops-hq-demo",
    trailingSlash: true,
    images: { unoptimized: true },
  }),
};

export default nextConfig;
