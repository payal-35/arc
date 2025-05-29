/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildPath: "api/index.js", // Important for Vercel
  server: "@remix-run/vercel" // Very Important
};
