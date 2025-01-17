/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: "https://acemotorsales.uk",
    generateRobotsTxt: true,
    sitemapSize: 5000,
    exclude: ["/dashboard"],
    changefreq: "monthly",
    priority: 0.7,
  };
  
  module.exports = config;
  