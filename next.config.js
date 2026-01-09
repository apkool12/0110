/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === "production";
// Vercel에서는 basePath가 필요 없음, GitHub Pages에서만 사용
const isGitHubPages = process.env.NEXT_PUBLIC_BASE_PATH === '/0110';
const basePath = isGitHubPages ? '/0110' : '';

const nextConfig = {
  // Vercel에서는 output: 'export'가 필요 없음 (서버 렌더링 지원)
  // GitHub Pages에서만 static export 필요
  ...(isGitHubPages && isProduction && { output: "export" }),
  compiler: {
    styledComponents: true,
  },
  images: {
    unoptimized: true,
  },
  // basePath는 GitHub Pages에서만 사용
  ...(basePath && {
    basePath: basePath,
    assetPrefix: basePath,
  }),
  trailingSlash: true,
};

export default nextConfig;
