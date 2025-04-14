import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        formats: ['image/webp'],
    },
    output: 'standalone',
};

export default nextConfig;
