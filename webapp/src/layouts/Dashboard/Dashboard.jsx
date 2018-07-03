import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';

import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';

import withStyles from '@material-ui/core/styles/withStyles';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Sidebar from '../../components/Sidebar/Sidebar';

import mainRoutes from '../../routes/mainRoutes';

import dashboardStyle from '../../assets/jss/material-dashboard-react/layouts/dashboardStyle';

import image from '../../assets/img/sidebar-2.jpg';
import logo from '../../assets/img/folklogo.png';

const switchRoutes = (
  <Switch>
    {mainRoutes.map((route) => {
      if (route.redirect) return <Redirect from={route.path} to={route.to} key={route.path} />;
      return <Route path={route.path} component={route.component} key={route.path} />;
    })}
  </Switch>
);

class App extends Component {
  state = {
    mobileOpen: false,
  }
  componentDidMount() {
    if (navigator.platform.includes('Win')) {
      // Generate the new scrollbar for windows user, no need to use
      // the variable that's why we disable the rule
      // eslint-disable-next-line no-unused-vars
      const ps = new PerfectScrollbar(this.mainPanelRef);
    }
  }
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.mainPanelRef.scrollTop = 0;
    }
  }
  setMainPanelRef(ref) {
    this.mainPanelRef = ref;
  }
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  }
  render() {
    const { classes, ...rest } = this.props;
    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={mainRoutes}
          logoText="folk"
          logo={logo}
          image={image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color="blue"
          {...rest}
        />
        <div className={classes.mainPanel} ref={this.setMainPanelRef.bind(this)}>
          <Header
            routes={mainRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />
          <div className={classes.content}>
            <div className={classes.container}>{switchRoutes}</div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(dashboardStyle)(App);
