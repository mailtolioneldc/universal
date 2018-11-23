const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const flexbugsfix = require('postcss-flexbugs-fixes');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');


const resolvePath = (pathname) => path.resolve(__dirname, pathname);

module.exports = (env) => {
  const ifDev = (...args) => (env.dev ? args : []);
  //  const ifProd = (...args) => (env.prod ? args : []);

  const NODE_ENV = env.dev ? 'development' : 'production';

  return {
    devtool: env.dev ? 'eval' : 'source-map',
    entry: {
      main: [
        'babel-polyfill',
        ...ifDev(
          'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false',
        ),
        ...ifDev('webpack/hot/dev-server'),
        resolvePath('../../src/client/entry/index.js'),
      ],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                [
                  'env',
                  {
                    modules: false,
                    targets: {
                      browsers: ['> 1%', 'last 2 versions'],
                    },
                    debug: env.dev,
                  },
                ],
                'react',
                'stage-0',
              ],
              plugins: ['react-loadable/babel', ...ifDev('react-hot-loader/babel')],
            },
          },
        },
        {
          test: /\.(scss|css)$/,
          use: [
            //hmr not supported yet by MiniCssExtractPlugin hence added style-loader
            env.dev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                minimize: {
                  safe: true,
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {},
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [
                  flexbugsfix,
                  autoprefixer({
                    browsers: ['> 1%', 'last 2 versions'],
                    flexbox: 'no-2009',
                  }),
                ],
              },
            },
          ],
        },
        {
          test: /\.(gif|ico|jpg|png|svg)$/,
          loader: 'url-loader',
        },
      ],
    },
    name: 'client',
    output: {
      filename: env.dev ? '[name].js' : '[name].[chunkhash].js',
      chunkFilename: env.dev ? '[name].js' : '[name].[chunkhash].js',
      path: resolvePath(`../../client/${NODE_ENV}`),
      publicPath: '/dist/',
    },
    plugins: [
      ...ifDev(new webpack.HotModuleReplacementPlugin()),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(NODE_ENV),
          REACT_CONTAINER_ID: JSON.stringify('react-container'),
        },
        __DEV__: !!env.dev,
      }),
      new ReactLoadablePlugin({
        filename: `./client/${NODE_ENV}/react.loadable.${NODE_ENV}.stats.webpack.json`,
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css',
      }),
      new ParallelUglifyPlugin({}),
    ],
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          sourceMap: true,
          parallel: 4,
        }),
        new OptimizeCSSAssetsPlugin({}),
      ],
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      },
    },
    resolve: {
      modules: [resolvePath('../../src'), 'node_modules'],
    },
    mode: NODE_ENV,
    target: 'web',
  };
};
