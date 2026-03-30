/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { hostname: "res.cloudinary.com" },
      { hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;