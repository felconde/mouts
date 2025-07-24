/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir: true, // Removido - não é mais necessário no Next.js 14
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
}

module.exports = nextConfig 