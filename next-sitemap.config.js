/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://fastpdfmaster.vercel.app",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  outDir: "./public",
  exclude: ["/404"],
  changefreq: "daily",
  priority: 0.7,
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
};
