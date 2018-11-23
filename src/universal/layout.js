/* eslint "react/prop-types": 0*/

import React, { Fragment } from 'react';
import { renderRoutes } from 'react-router-config';

export default ({ route }) => {
  return <Fragment>{renderRoutes(route.routes)}</Fragment>;
};
