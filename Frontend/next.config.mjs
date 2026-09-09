/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  allowedDevOrigins: ["192.168.31.152"],

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://portfolio-w2ph.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;