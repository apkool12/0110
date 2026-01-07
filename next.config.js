/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  compiler: {
    styledComponents: true,
  },
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/0110' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/0110' : '',
  trailingSlash: true,
};

export default nextConfig;

