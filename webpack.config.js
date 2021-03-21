const { resolve, join } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin // yarn build时会触发分析器

module.exports = {
  // mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx'], // 导入时这些后缀名不用写
    alias: {
      '@': resolve('src') // 配置别名
    }
  },
  entry: join(__dirname, 'index.js'),
  // entry: ['./App.js','./src/index.js'], // 多入口
  // entry: {
  //   one: './App.js',
  //   two: './src/index.js'
  // },
  output: {
    path: join(__dirname, 'dist'),
    filename: 'bundle.js'
    // filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: '/src',
        use: ['thread-loader', 'babel-loader']
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/, // 优先级比teset和include都高，不解析node_modules中的文件
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false, // 不要再去找babelrc文件了，规则全在这指定完了
            presets: ['@babel/preset-react', ['@babel/preset-env', { modules: false }]], // modules: false，不要把import当成es6模块化解析，因为webpack已经
            cacheDirectory: true // 给编译加个缓存
          }
        }
      },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 7000 // 7000字节以下的图片转为base64
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // 将打包好的文件用script标签包裹插入到html文件中
    new HtmlWebpackPlugin({
      template: join(__dirname, 'public/index.html'), // 可指定插入哪个html中，如果不写，则新建一个
      filename: 'index.html', // 生成的文件名
      minify: {
        collapseWhitespace: true, // 压缩空格
        removeComments: true //移除注释
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new BundleAnalyzerPlugin()
  ],
  devServer: {
    contentBase: join(__dirname, '/public'), // 静态文件
    compress: true, // 压缩
    port: 3000,
    open: true, //
    hot: true // 热加载
  },
  optimization: {
    minimize: true,
    minimizer: [
      // 压缩代码
      new TerserPlugin({
        parallel: true, // 开启多线程
        terserOptions: {
          compress: {
            unused: true,
            dead_code: true,
            drop_debugger: true,
            drop_console: true
          }
        }
      })
    ]
  }
}
