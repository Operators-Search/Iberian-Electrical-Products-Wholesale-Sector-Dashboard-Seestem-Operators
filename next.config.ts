import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep build output behind a local junction that points outside OneDrive on
  // Windows. The helper script prepares the junction before Next starts.
  distDir: "next-build-link",
};

export default nextConfig;
