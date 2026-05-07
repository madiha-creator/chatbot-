import type { NextConfig } from "next";

// Fix SSL certificate verification issues in environments with corporate proxies
// or outdated certificate stores (UNABLE_TO_VERIFY_LEAF_SIGNATURE)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
