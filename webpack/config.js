const path = require('path'); // 调用路径
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');  // 引入打包html的插件

module.exports = ({ env }) => {
  const devMode = env === "development";
  return {
    mode: 'production',
    entry: {
      app: devMode ? [
        'webpack-hot-middleware/client?reload=true&quiet=true', './src/app.ts'
      ] :
        ['./src/app.ts'],
    },
    devtool: devMode ? 'eval-cheap-module-source-map' : false,
    devServer: {
      static: './dist',
    },
    // 用来设置引用模块
    resolve: {
      extensions: [".ts", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']  // 顺序一定是这样
        },
        {
          test: /\.(jpe?g|png)$/,
          loader: 'url-loader'
        },
        {
          test: /.ts$/,
          use: {
            loader: "ts-loader",
          },
          exclude: /node_modules/,
        },
        {
          test: /\.glsl$/,
          loader: 'raw-loader'
        }
      ]
    },
    output: {
      filename: '[name].[contenthash:10].js',
      path: path.resolve(__dirname, '../dist'),
      clean: true,
      // 增加这个配置
      // publicPath: '/',
    },
    plugins: [
      // html 
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../public/index.html'), // 文件模板
        chunks: ['app']
      }),
      devMode && new webpack.HotModuleReplacementPlugin(),
    ]
  };
};

