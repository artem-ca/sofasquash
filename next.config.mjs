/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactCompiler: true,
  // Статический экспорт: сервера оптимизации нет, next/image отдаёт файлы как есть
  images: { unoptimized: true },
}

export default nextConfig
