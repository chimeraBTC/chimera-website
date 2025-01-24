/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three', '@react-three/postprocessing', 'postprocessing'],
};

export default nextConfig;
