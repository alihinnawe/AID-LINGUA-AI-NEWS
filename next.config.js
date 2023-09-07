/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias["/node_modules/@ffmpeg/core/dist/ffmpeg-core.js"] =
      "/node_modules/@ffmpeg/core/dist/ffmpeg-core.js";
    config.resolve.alias["fs"] = false;
    config.resolve.alias["/node_modules/axios/"] = "/node_modules/axios/";
    config.resolve.alias["fs"] = false;
    return config;
  },
};

module.exports = nextConfig;
