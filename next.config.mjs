/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;