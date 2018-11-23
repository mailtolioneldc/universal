import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import './style1.css';

const AppContaienr = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  width: 5%;
  height: 5%;
  font-size: 40px;
`;

const IndexPage = () => (
  <section>
    <Helmet>
      <title>Page 2</title>
    </Helmet>

    <h1>Page 1</h1>

    <Link to="/not-found" href="Not Found Page">
      <p>Go to Not Found Page</p>
      <AppContaienr>💅</AppContaienr>
    </Link>
  </section>
);

export default IndexPage;
