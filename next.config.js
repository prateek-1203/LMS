/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',      // Specify the protocol (http or https)
                hostname: 'utfs.io',    // The domain of the external image source
                // port: '',            // Optional: Specify the port if needed
                pathname: '/**',    
            }
        ]
    }
}

module.exports = nextConfig
