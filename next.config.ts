import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thumbnail.image.rakuten.co.jp",
      },
      {
        protocol: "https",
        hostname: "image.rakuten.co.jp",
      },
    ],
  },
  // vercel.app の旧URLへのアクセスをカスタムドメインに 301 リダイレクト。
  // Google が旧URLをインデックスしている場合の canonical 統一に必要。
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "gaming-hikaku-lab.vercel.app" }],
        destination: "https://gaming-hikaku-lab.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
