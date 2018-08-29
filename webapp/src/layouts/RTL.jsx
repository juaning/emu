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

import rtlRoutes, { sidebarLinks } from '../routes/pro/rtl';

import rtlStyle from '../assets/jss/material-dashboard-pro-react/layouts/rtlStyle';

import image from '../assets/img/sidebar-2.jpg';
import logo from '../assets/img/logo-white.svg';

const switchRoutes = (
  <Switch>
    {rtlRoutes.map((prop) => {
      const rtlRouteKey = shortid.generate();
      if (prop.redirect) {
        return <Redirect from={prop.path} to={prop.pathTo} key={rtlRouteKey} />;
      }
      if (prop.collapse) {
        return prop.views.map((viewProp) => {
          const viewKey = shortid.generate();
          return (
            <Route path={viewProp.path} component={viewProp.component} key={viewKey} />
          );
        });
      }
      return <Route path={prop.path} component={prop.component} key={rtlRouteKey} />;
    })}
  </Switch>
);

class RTL extends React.Component {
  state = {
    mobileOpen: false,
    miniActive: false,
  };
  componentDidMount() {
    if (navigator.platform.indexOf('Win') > -1) {
      // eslint-disable-next-line
      const ps = new PerfectScrollbar(this.mainPanel.current);
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
  mainPanelRef = React.createRef()
  handleDrawerToggle() {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  }
  sidebarMinimize() {
    this.setState({ miniActive: !this.state.miniActive });
  }
  sidebarMinimize = this.sidebarMinimize.bind(this);
  render() {
    const { classes, ...rest } = this.props;
    const mainPanel =
      `${classes.mainPanel} ${cx({
        [classes.mainPanelSidebarMini]: this.state.miniActive,
      })}`;
    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={sidebarLinks}
          logoText="توقيت الإبداعية"
          logo={logo}
          image={image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color="blue"
          bgColor="black"
          miniActive={this.state.miniActive}
          rtlActive
          {...rest}
        />
        <div className={mainPanel} ref={this.mainPanelRef}>
          <Header
            rtlActive
            sidebarMinimize={this.sidebarMinimize}
            miniActive={this.state.miniActive}
            routes={rtlRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />
          <div className={classes.content}>
            <div className={classes.container}>{switchRoutes}</div>
          </div>
          <Footer fluid rtlActive />
        </div>
      </div>
    );
  }
}

RTL.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(rtlStyle)(RTL);
