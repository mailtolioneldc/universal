import React, {Fragment} from 'react';
import { withRouter } from 'react-router-dom';
import renderRoutes from 'react-router-config/renderRoutes';

const App = ({route}) => {
  return <Fragment>{renderRoutes(route.routes)}</Fragment>;
};

export default withRouter(App);
