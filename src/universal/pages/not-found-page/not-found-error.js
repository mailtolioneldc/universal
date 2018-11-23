/* eslint "react/prop-types": 0*/
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { getPageTitle } from './../../services/page/actionSaga';
import { getPageTitleAction } from './../../services/page/actionCreator';

import Loadable from 'react-loadable';
import LoadingPage from 'universal/pages/loading-page';

const Title =  Loadable({
  loader: () => import('./title'),
  loading: LoadingPage,
});

class NotFoundError extends Component {
  
  static preLoad = () => [[getPageTitle, 'Not Found Page error']];

  constructor(props) {
    super(props);
  }

  componentDidMount() {

    //this.props.dispatch(getPageTitleAction('NOT FOUND'));
  }

  render() {
    return (
      <section>
        <Helmet>
          <title>{this.props.page_title}</title>
        </Helmet>

        <h1>Not found error page</h1>
        <Title />
        <Link to="/not-found" href="Home Page">
          <p>Go to Not found page</p>
        </Link>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    page_title: state.Page.pageTitle,
  };
}
export default connect(mapStateToProps)(NotFoundError);
