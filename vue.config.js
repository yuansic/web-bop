const glob = require('glob');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];

// 获取指定路径下的入口文件
let getMultiEntry = () => {
  var files = glob.sync('./src/views/**/entry.js');
  var entries = {};
  files.forEach(filepath => {
    var split = filepath.split('/');
    var name = split[split.length - 2];
    entries[name] = {
      entry: 'src/views/' + name + '/entry.js',
      template: 'src/views/' + name + '/index.html',
      filename: name + '.html'
      // chunks: ['chunk-vendors', 'chunk-common', name]
    };
  });
  return entries;
};
let pages = getMultiEntry();

module.exports = {
  lintOnSave: false,
  pages: pages,
  productionSourceMap: false,
  publicPath: './',
  outputDir: process.env.VUE_APP_OUTPUTDIR,
  assetsDir: 'static',
  devServer: {
    open: true,
    port: 8099,
    proxy: {
      '/staging': {
        target: 'http://192.168.12.133:3100',
        changeOrigin: true,
        pathRewrite: {
          '^/staging': ''
        }
      }
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
            threshold: 10240,
            minRatio: 0.8
          })
        ]
      };
    } else {
      // 为开发环境修改配置...
    }
  },
  chainWebpack: config => {
    // 这里可以修改webpack配置
    // 移除预加载
    Object.keys(pages).forEach(entryName => {
      config.plugins.delete(`prefetch-${entryName}`);
    });
  }
};
