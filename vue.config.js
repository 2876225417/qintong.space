module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  publicPath: '/', // 确保public路径正确
  configureWebpack: {
    devtool: 'source-map', // 如果需要调试
  },
};
