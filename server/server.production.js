/*eslint no-console: ["error", { allow: ["warn", "log", "error", "info"] }] */

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';
if (!process.env.SERVER_HOST) process.env.SERVER_HOST = 'localhost';
if (!process.env.SERVER_PORT) process.env.SERVER_PORT = 3000;

const express = require('express');
const cluster = require('cluster');
const shrinkRay = require('shrink-ray');
const reactLoadableStats = require('../client/production/react.loadable.production.stats.webpack.json');
const webpackClientConfig = require('../config/webpack/client.config')({
  prod: true,
});
const webpackServerConfig = require('../config/webpack/server.config')({
  prod: true,
});

const clientOutputPath = webpackClientConfig.output.path;
const serverOutputPath = webpackServerConfig.output.path;

const clientStats = require(`${clientOutputPath}/client.production.stats.webpack.json`);
const serverStats = require(`${serverOutputPath}/server.production.stats.webpack.json`);
const serverSideRender = require(`${serverOutputPath}/serverSideRender`).default;

const server = express();

server.use(shrinkRay());

server.disable('x-powered-by');

server.use('/dist', express.static(clientOutputPath));
const cpuCount = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master pid: ${process.pid}`);

  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  server.use(serverSideRender({ clientStats, serverStats, reactLoadableStats }));

  server.listen(process.env.SERVER_PORT, (error) => {
    if (error) {
      console.error(error);
    } else {
      console.log(
        `Server listening at http://${process.env.SERVER_HOST}:${
          process.env.SERVER_PORT
        }`,
      );
      console.info(
        `Server running on port ${process.env.SERVER_PORT} -- Worker pid: ${
          cluster.worker.process.pid
        }`,
      );
    }
  });
}
