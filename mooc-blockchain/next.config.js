/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["kltn-mooc-blockchain.s3.ap-southeast-1.amazonaws.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
