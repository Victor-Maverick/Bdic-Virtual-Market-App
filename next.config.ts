import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        // Allow images from all domains (use with caution in production)
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.digitalmarke.bdic.ng',
            },
        ],
    },
    output: 'standalone',

};

export default nextConfig;