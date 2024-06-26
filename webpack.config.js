const path = require('node:path')
const process = require('node:process')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ProgressBarPlugin = require('webpackbar')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isAnalyzer = process.env.NODE_ENV === 'analyzer'

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: './src/index.tsx',
  output: {
    filename: '[name].[contenthash].js',
    assetModuleFilename: 'images/[name]-[hash][ext][query]',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  stats: 'errors-only', // 只输出错误信息
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new ForkTsCheckerWebpackPlugin(),
    new ProgressBarPlugin(),
    isAnalyzer && new BundleAnalyzerPlugin(),
    isDev && new ReactRefreshWebpackPlugin(),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      // @src: path.resolve(__dirname, 'src/'),
    },
  },
  devServer: {
    compress: true,
    port: 9000,
    hot: true,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                namedExport: false,
              },
            },
          },
        ],
      },
      {
        test: /\.less$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                namedExport: false,
              },
            },
          },
          'less-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }],
              ['@babel/preset-react', { runtime: 'automatic' }],
              ['@babel/preset-typescript'],
            ],
            plugins: [isDev && require.resolve('react-refresh/babel')].filter(Boolean),
          },
        },
      },
    ],
  },
  watchOptions: {
    // for some systems, watching many files can result in a lot of CPU or memory usage
    // https://webpack.js.org/configuration/watch/#watchoptionsignored
    // don't use this pattern, if you have a monorepo with linked packages
    ignored: /node_modules/,
  },
  optimization: {
    // minimize: false,//生产环境在自动开启压缩
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial',
        },
        echarts: {
          name: 'chunk-echarts',
          priority: 20,
          test: /[\\/]node_modules[\\/]_?echarts|zrender(.*)/,
        },
        commons: {
          name: 'chunk-commons',
          minChunks: 3, // minimum common number
          priority: 5,
          reuseExistingChunk: true,
        },
        lib: {
          test(module) {
            return (
              module.size() > 160000
              && /node_modules[/\\]/.test(module.nameForCondition() || '')
            )
          },
          name(module) {
            const packageNameArr = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)
            const packageName = packageNameArr ? packageNameArr[1] : ''
            // npm package names are URL-safe, but some servers don't like @ symbols
            return `chunk-lib.${packageName.replace('@', '')}`
          },
          priority: 15,
          minChunks: 1,
          reuseExistingChunk: true,
        },
      },
    },
  },
}
