/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (isProduction ? '/0110' : '');

const nextConfig = {
  // output: 'export'는 빌드 시에만 필요하므로 개발 모드에서는 주석 처리
  // 개발 서버에서 static export 모드가 문제를 일으킬 수 있음
  ...(isProduction && { output: 'export' }),
  compiler: {
    styledComponents: true,
  },
  images: {
    unoptimized: true,
  },
  basePath: basePath,
  assetPrefix: basePath,
  trailingSlash: true,
};

export default nextConfig;

