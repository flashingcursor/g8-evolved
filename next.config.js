/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Handle JointJS and its dependencies
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel.live; script-src-elem 'self' 'unsafe-inline' https://vercel.live https://*.vercel.live; worker-src 'self' blob:;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
