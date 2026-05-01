/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'darakbang.s3.ap-northeast-2.amazonaws.com',
        pathname: '/theone/photos/**',
      },
    ],
  },
};

export default nextConfig;
