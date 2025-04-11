import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Use standalone output for simplified server deployment
    output: "standalone",

    // Enable production optimizations
    compress: true,


    // Add environment-specific configurations
    env: {
        // Define custom variables accessible in your app
        // Example: NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },




    // Configure rewrites or redirects if needed
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "https://your-backend.com/api/:path*",
            },
        ];
    },
};

export default nextConfig;