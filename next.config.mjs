/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize pg and related packages for server-side to avoid bundling issues
      config.externals = config.externals || []
      config.externals.push({
        'pg': 'commonjs pg',
        'pg-pool': 'commonjs pg-pool',
        'pg-protocol': 'commonjs pg-protocol',
        'pg-connection-string': 'commonjs pg-connection-string',
      })
    }
    return config
  },
}

export default nextConfig
