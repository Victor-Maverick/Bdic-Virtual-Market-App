/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ['image/webp'],
    },
    output: 'standalone', // Lean deployment
};

module.exports = nextConfig;