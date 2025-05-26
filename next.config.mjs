/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      domains: ['img.clerk.com'], // Add any other domains you use for images here
    },
  };
  
  export default nextConfig;
  