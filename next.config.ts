import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Providers can paste any https image URL for their gear.
      { protocol: "https", hostname: "**" },
    ],
  },
  async redirects() {
    return [
      { source: "/login", destination: "/auth/login", permanent: false },
      { source: "/register", destination: "/auth/register", permanent: false },
      {
        source: "/dashboard/provider/gears",
        destination: "/dashboard/provider/gear",
        permanent: false,
      },
      {
        source: "/dashboard/admin/category",
        destination: "/dashboard/admin/categories",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
