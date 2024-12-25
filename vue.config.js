const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 5000,
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', handleProxyError);
          proxy.on('proxyReq', handleProxyReq);
          proxy.on('proxyRes', handleProxyRes);
        }
      }      
    }
  }
})
