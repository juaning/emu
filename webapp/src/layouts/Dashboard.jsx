import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import shortid from 'shortid';
// creates a beautiful scrollbar
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

// core components
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Sidebar from '../components/Sidebar/Sidebar';

import dashboardRoutes from '../routes/pro/dashboard';

import appStyle from '../assets/jss/material-dashboard-pro-react/layouts/dashboardStyle';

import image from '../assets/img/sidebar-2.jpg';
import logo from '../assets/img/logo-white.svg';

const switchRoutes = (
  <Switch>
    {dashboardRoutes.map((prop) => {
      const routesKey = shortid.generate();
      if (prop.redirect) {
        return <Redirect from={prop.path} to={prop.pathTo} key={routesKey} />;
      }
      if (prop.collapse) {
        return prop.views.map((viewProp) => {
          const viewKey = shortid.generate();
          return (
            <Route path={viewProp.path} component={viewProp.component} key={viewKey} />
          );
        });
      }
      return <Route path={prop.path} component={prop.component} key={routesKey} />;
    })}
  </Switch>
);

let ps;

class Dashboard extends React.Component {
  state = {
    mobileOpen: false,
    miniActive: false,
  };
  componentDidMount() {
    if (navigator.platform.indexOf('Win') > -1) {
      ps = new PerfectScrollbar(this.mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
      document.body.style.overflow = 'hidden';
    }
  }
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.mainPanel.current.scrollTop = 0;
      // if (this.state.mobileOpen) {
      //   this.setState({ mobileOpen: false });
      // }
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf('Win') > -1) {
      ps.destroy();
    }
  }
  getRoute() {
    return this.props.location.pathname !== '/maps/full-screen-maps';
  }
  handleDrawerToggle() {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  }
  mainPanelRef = React.createRef();
  sidebarMinimize() {
    this.setState({ miniActive: !this.state.miniActive });
  }
  sidebarMinimize = this.sidebarMinimize.bind(this)
  render() {
    const { classes, ...rest } = this.props;
    const mainPanel =
      `${classes.mainPanel} ${cx({
        [classes.mainPanelSidebarMini]: this.state.miniActive,
        [classes.mainPanelWithPerfectScrollbar]:
          navigator.platform.indexOf('Win') > -1,
      })}`;
    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={dashboardRoutes}
          logoText="Creative Tim"
          logo={logo}
          image={image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color="blue"
          bgColor="black"
          miniActive={this.state.miniActive}
          {...rest}
        />
        <div className={mainPanel} ref={this.mainPanelRef}>
          <Header
            sidebarMinimize={this.sidebarMinimize}
            miniActive={this.state.miniActive}
            routes={dashboardRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />
          {/* On the /maps/full-screen-maps route we want the map to be on full
            * screen - this is not possible if the content and conatiner classes
            * are present because they have some paddings which would make the
            * map smaller */}
          {this.getRoute() ? (
            <div className={classes.content}>
              <div className={classes.container}>{switchRoutes}</div>
            </div>
          ) : (
            <div className={classes.map}>{switchRoutes}</div>
          )}
          {this.getRoute() ? <Footer fluid /> : null}
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

Dashboard.defaultProps = {
  location: {
    pathname: '',
  },
};

export default withStyles(appStyle)(Dashboard);
