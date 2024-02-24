/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      "res.cloudinary.com",
      "simpleicons.org",
      "authjs.dev",
      "reactjs.org", // For React
      "vuejs.org", // Assuming a hypothetical direct link to a Vue logo hosted on their domain
      "angular.io", // For Angular
      "www.djangoproject.com", // For Django
      "flutter.dev", // For Flutter
      "nodejs.org", // For Node.js
      "www.tensorflow.org", // For TensorFlow
      "kubernetes.io", // For Kubernetes
      "kafka.apache.org", // For Apache Kafka
      "www.rust-lang.org", // For Rust
      "simpleicons.org", // For logos sourced from Simple Icons
    ],
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
