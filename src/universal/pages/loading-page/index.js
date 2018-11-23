import React from 'react';
import { Helmet } from 'react-helmet';
import './style.scss';

const LoadingPage = () => (
  <section>
    <Helmet>
      <title>Loading...</title>
    </Helmet>

    <p>Loading...</p>
  </section>
);

export default LoadingPage;
