/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['ar', 'en', 'fr'],
    defaultLocale: 'ar',
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
