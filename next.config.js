/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: ["res.cloudinary.com", "simpleicons.org", "authjs.dev"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "worknify-project-logo.s3.eu-west-1.amazonaws.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
