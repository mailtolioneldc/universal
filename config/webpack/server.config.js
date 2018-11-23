const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const flexbugsfix = require('postcss-flexbugs-fixes');

const resolvePath = (pathname) => path.resolve(__dirname, pathname);

module.exports = (env) => {
  const ifDev = (...args) => (env.dev ? args : []);

  const NODE_ENV = env.dev ? 'development' : 'production';

  return {
    devtool: env.dev ? 'eval' : 'source-map',
    entry: [resolvePath('../../src/server/entry/index.js')],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            plugins: ['react-loadable/babel', ...ifDev('react-hot-loader/babel')],
            presets: [
              [
                'env',
                {
                  modules: false,
                  targets: {
                    node: '8.10',
                  },
                },
              ],
              'react',
              'stage-0',
            ],
          },
        },
        {
          test: /\.(scss|css)$/,
          use: [
            //since mini-css-extract-plugin & also style-loader doesn't support HMR in ssr we need to fix issue here
            MiniCssExtractPlugin.loader,
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
    name: 'server',
    output: {
      filename: 'serverSideRender.js',
      libraryTarget: 'commonjs2',
      path: resolvePath(`../../server/${NODE_ENV}`),
    },
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(`${NODE_ENV}`),
          REACT_CONTAINER_ID: JSON.stringify('react-container'),
        },
        __DEV__: !!env.dev,
      }),
      new MiniCssExtractPlugin({ filename: '[name].css' }),
    ],
    resolve: {
      modules: [resolvePath('../../src'), 'node_modules'],
    },
    mode: NODE_ENV,
    target: 'node',
  };
};
