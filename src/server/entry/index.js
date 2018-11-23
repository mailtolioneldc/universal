import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { preloadAll } from 'react-loadable';
import Html from 'server/html';
import { Provider } from 'react-redux';
import configureStore from 'universal/services';
import { ServerStyleSheet } from 'styled-components';
//import fetchDataForRender from '../helpers/fetchDataForRender';
import RouteOptions from 'universal/routes';
import renderRoutes from 'react-router-config/renderRoutes';
import matchRoutes from 'react-router-config/matchRoutes';
import waitAll from '../helpers/waitAll';
import {convertCustomRouteConfig} from 'universal/utils/convertcustomRouteConfig';

const routeConfig = convertCustomRouteConfig(RouteOptions);
const preloadedState = {};
const store = configureStore(preloadedState);

const serverSideRender = (stats) => async (req, res) => {
  await preloadAll();

  //if you want fetch data without saga then use below
  //await fetchDataForRender(req, store);

  const preLoaders = matchRoutes(routeConfig, req.url)
    .filter(({ route }) => route.component && route.component.preLoad)
    .map(({ route, match }) => route.component.preLoad(match, req))
    .reduce((result, preLoader) => result.concat(preLoader), []);

  const runTasks = store.runSaga(waitAll(preLoaders));
  
  runTasks.done.then(() => {
    const { clientStats, reactLoadableStats } = stats;
    const context = {};
    const state = store.getState();
    const sheet = new ServerStyleSheet();

    const Component = (
      <Html
        clientStats={clientStats}
        reactLoadableStats={reactLoadableStats}
        initialState={state}
      >
        <Provider store={store}>
          <StaticRouter context={context} location={req.url}>
            {renderRoutes(routeConfig)}
          </StaticRouter>
        </Provider>
      </Html>
    );

    const jsx = sheet.collectStyles(Component);

    const stream = sheet.interleaveWithNodeStream(renderToNodeStream(jsx));

    res.type('html');

    res.write('<!doctype html>');

    stream.pipe(res, { end: false });
    stream.on('end', () => {
      return res.send();
    });
    store.close();
  });
};

export default serverSideRender;
