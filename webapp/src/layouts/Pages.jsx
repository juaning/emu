import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import shortid from 'shortid';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

// core components
import PagesHeader from '../components/Header/PagesHeader';
import Footer from '../components/Footer/Footer';

import pagesRoutes from '../routes/pro/pages';

import pagesStyle from '../assets/jss/material-dashboard-pro-react/layouts/pagesStyle';

import bgImage from '../assets/img/register.jpeg';

// var ps;

class Pages extends React.Component {
  pageWrapperRef = React.createRef();
  render() {
    const { classes, ...rest } = this.props;
    return (
      <div>
        <PagesHeader {...rest} />
        <div className={classes.wrapper} ref={this.pageWrapperRef}>
          <div className={classes.fullPage}>
            <Switch>
              {pagesRoutes.map((prop) => {
                const routeKey = shortid.generate();
                if (prop.collapse) {
                  return null;
                }
                if (prop.redirect) {
                  return (
                    <Redirect from={prop.path} to={prop.pathTo} key={routeKey} />
                  );
                }
                return (
                  <Route
                    path={prop.path}
                    component={prop.component}
                    key={routeKey}
                  />
                );
              })}
            </Switch>
            <Footer white />
            <div
              className={classes.fullPageBackground}
              style={{ backgroundImage: `url(${bgImage})` }}
            />
          </div>
        </div>
      </div>
    );
  }
}

Pages.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(pagesStyle)(Pages);
