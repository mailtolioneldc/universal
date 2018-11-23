/* eslint "react/prop-types": 0*/
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { getPageTitle } from './../../services/page/actionSaga';
import { getPageTitleAction } from './../../services/page/actionCreator';
import LoadingPage from 'universal/pages/loading-page';


class NotFound extends Component {
  
  static preLoad = () => [[getPageTitle, 'Not Found Page']];

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
        <Link to="/not-found/1" href="Home Page">
          <p>Go to Not found error page</p>
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
export default connect(mapStateToProps)(NotFound);
