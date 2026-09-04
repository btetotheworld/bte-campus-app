import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AGENTS.md is the canonical file. Do not let next dev append to it.
  agentRules: false,
};

export default nextConfig;
