/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'mammoth', '@prisma/client'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'pdf-parse'];
    }
    return config;
  },
};

export default nextConfig;
