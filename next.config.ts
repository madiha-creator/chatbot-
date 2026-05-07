import type { NextConfig } from "next";

// Fix SSL certificate issues on local dev (corporate proxy / outdated cert store)
// This only runs during `next dev` — Vercel's servers don't need it
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
