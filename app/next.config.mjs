import { createCivicAuthPlugin } from "@civic/auth/nextjs";

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");

    config.optimization.splitChunks = {
      chunks: "all",
    };

    return config;
  },
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: "7ae45c93-d0df-41cd-ae1c-bf8bed017a2a"
});

export default withCivicAuth(nextConfig);
