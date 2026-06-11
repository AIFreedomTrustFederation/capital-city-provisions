/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Vercel deploys should not be blocked by type errors while the app is under active MVP hardening.
    // Keep running `npm run typecheck` separately before production traffic.
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      path: false,
      crypto: false,
      stream: false,
      worker_threads: false,
    };
    return config;
  },
};

export default nextConfig;
