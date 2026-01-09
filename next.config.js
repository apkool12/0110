/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export'는 빌드 시에만 필요하므로 개발 모드에서는 주석 처리
  // 개발 서버에서 static export 모드가 문제를 일으킬 수 있음
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
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

