# vue-stream-demo

**Vue Stream Demo** is a Vue.js project that demonstrates how to integrate and handle real-time streaming server responses in the browser. It is designed for showcasing the integration of APIs requiring authentication and supporting streamed data.

Key features:
- **Proxy Support**: Configured for seamless API calls using Vue CLI's development server proxy.
- **Real-Time Streaming**: Handles streamed responses and updates the UI dynamically as data arrives.
- **Authentication Ready**: Includes placeholders for setting up `username` and `password` for API authentication.


## Configuration Instructions

### Update Server IP in `vue.config.js`
Before running the project, you need to set the correct target IP for the proxy to your company's server. Open `vue.config.js` and update the `target` field to the appropriate server IP address.

Example:
```javascript
proxy: {
  '/api': {
    target: 'http://your-server-ip', // Replace with your server IP
    changeOrigin: true,
    configure: (proxy) => {
      proxy.on('error', handleProxyError);
      proxy.on('proxyReq', handleProxyReq);
      proxy.on('proxyRes', handleProxyRes);
    }
  }
}
```


## Update Authentication Credentials in App.vue
Update the username and password variables in App.vue with your actual credentials.

Example:
```vue
const username = "your-username"; // Replace with your username
const password = "your-password"; // Replace with your password
```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
