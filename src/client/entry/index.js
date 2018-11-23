/*eslint no-console: ["error", { allow: ["warn", "log"] }] */

import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { preloadReady } from 'react-loadable';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';
import configureStore from 'universal/services';
import renderRoutes from 'react-router-config/renderRoutes';
import RouteOptions from 'universal/routes';
import {convertCustomRouteConfig} from 'universal/utils/convertcustomRouteConfig';

const routeConfig = convertCustomRouteConfig(RouteOptions);

var preloadedState = {};
if (typeof window != 'undefined' && window.__PRELOADED_STATE__) {
  preloadedState = window.__PRELOADED_STATE__;
  delete window.__PRELOADED_STATE__;
}
console.log('preloadedState', preloadedState);
export const store = configureStore(preloadedState);

/*
export const clientSideRender = async ( 
  //Component = hot(module)(renderRoutes(RouteOptions)),
  container = document.getElementById(process.env.REACT_CONTAINER_ID),
  callback = () => console.log('clientSideRender'),
) => {
  await preloadReady();

  hydrate(
    <Provider store={store}>
      <BrowserRouter>
        {renderRoutes(RouteOptions)}
      </BrowserRouter>
    </Provider>,
    container,
    callback,
  );
};

clientSideRender();
*/

export const clientSideRender = async (
  container = document.getElementById(process.env.REACT_CONTAINER_ID),
  callback = () => console.log('clientSideRender')) => {

  const renderApp = _routes =>{
      hydrate(
        <Provider store={store}>
        <BrowserRouter>
          {renderRoutes(_routes)}
        </BrowserRouter>
      </Provider>,
      container,
      callback,
      )}; 

    await preloadReady();

    renderApp(routeConfig);

    if (module.hot) {
      module.hot.accept(() => {
        const RouteOptions = require('universal/routes');
        const routeConfig = convertCustomRouteConfig(RouteOptions);
        const nextAppRoutes = (routeConfig.default || routeConfig);
        renderApp(nextAppRoutes);
      });
    }
};

clientSideRender();