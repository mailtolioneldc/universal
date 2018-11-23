/* eslint no-console : 0 */
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
if (!process.env.SERVER_HOST) process.env.SERVER_HOST = 'localhost';
if (!process.env.SERVER_PORT) process.env.SERVER_PORT = 3000;

const webpack = require('webpack');
const express = require('express');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

const config = require('../config/webpack/client.config')({
  dev: true,
});

const scriptPaths = [
  config.output.publicPath + '/vendor.js',
  config.output.publicPath + '/runtime.js',
  config.output.publicPath + '/main.js',
];
const initialState = JSON.stringify({});

const app = express();
const compiler = webpack(config);
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.use('/assets', express.static('assets'));
app.use('/dist', express.static(config.output.publicPath));

app.use(
  devMiddleware(compiler, {
    publicPath: config.output.publicPath,
    historyApiFallback: true,
    hot: true,
    stats: {
      colors: true,
    },
    performance: true,
  }),
);
app.use(hotMiddleware(compiler));

app.get('*', (req, res) => {
  res.render('index', { scriptPaths, initialState });
});

app.listen(3000, function(err) {
  if (err) {
    return console.error(err);
  }
  console.log('Listening at http://localhost:3000/');
});
