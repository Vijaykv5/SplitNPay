const nextConfig = {
  reactStrictMode: true, 
  experimental: {
    appDir: true, 
  },
  webpack: (config) => {
    
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

   
    config.optimization.splitChunks = {
      chunks: 'all',
    };

    return config;
  },
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
