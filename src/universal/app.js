import React from 'react';
import { withRouter } from 'react-router-dom';
import renderRoutes from 'react-router-config/renderRoutes';
import { hot } from 'react-hot-loader';
import RouteOptions from './routes';

const App = () => {
  return <div>{renderRoutes(RouteOptions)}</div>;
};

export default hot(module)(withRouter(App));
