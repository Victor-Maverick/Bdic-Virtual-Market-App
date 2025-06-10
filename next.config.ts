import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http', // Allow HTTP (less secure)
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'api.digitalmarke.bdic.ng',
            },
        ],
    },
    output: 'standalone',
};

export default nextConfig;
