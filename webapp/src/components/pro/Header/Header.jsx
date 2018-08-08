import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';

// material-ui icons
import Menu from '@material-ui/icons/Menu';
import MoreVert from '@material-ui/icons/MoreVert';
import ViewList from '@material-ui/icons/ViewList';

// core components
import HeaderLinks from './HeaderLinks';
import Button from '../../components/CustomButtons/Button';

import headerStyle from '../../assets/jss/material-dashboard-pro-react/components/headerStyle';

function Header({ ...props }) {
  function makeBrand() {
    let brandName;
    props.routes.map((route) => {
      if (route.collapse) {
        route.views.map((view) => {
          if (view.path === props.location.pathname) {
            brandName = view.name;
          }
          return null;
        });
      }
      if (route.path === props.location.pathname) {
        brandName = route.name;
      }
      return null;
    });
    return brandName;
  }
  const { classes, color, rtlActive } = props;
  const appBarClasses = cx({
    [` ${classes[color]}`]: color,
  });
  const sidebarMinimize =
    `${classes.sidebarMinimize} ${cx({ [classes.sidebarMinimizeRTL]: rtlActive })}`;
  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <Hidden smDown>
          <div className={sidebarMinimize}>
            {props.miniActive ? (
              <Button
                justIcon
                round
                color="white"
                onClick={props.sidebarMinimize}
              >
                <ViewList className={classes.sidebarMiniIcon} />
              </Button>
            ) : (
              <Button
                justIcon
                round
                color="white"
                onClick={props.sidebarMinimize}
              >
                <MoreVert className={classes.sidebarMiniIcon} />
              </Button>
            )}
          </div>
        </Hidden>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          <Button href="#" className={classes.title} color="transparent">
            {makeBrand()}
          </Button>
        </div>
        <Hidden smDown implementation="css">
          <HeaderLinks rtlActive={rtlActive} />
        </Hidden>
        <Hidden mdUp>
          <Button
            className={classes.appResponsive}
            color="transparent"
            justIcon
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
          >
            <Menu />
          </Button>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  color: PropTypes.oneOf([
    'primary',
    'info',
    'success',
    'warning',
    'danger',
  ]),
  routes: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string,
    navbarName: PropTypes.string,
  })),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  handleDrawerToggle: PropTypes.func,
  rtlActive: PropTypes.bool,
  miniActive: PropTypes.bool,
  sidebarMinimize: PropTypes.func,
};

Header.defaultProps = {
  color: 'success',
  routes: [{
    path: '',
    navbarName: '',
  }],
  location: {
    pathname: '',
  },
  handleDrawerToggle: () => {},
  rtlActive: false,
  miniActive: false,
  sidebarMinimize: () => {},
};

export default withStyles(headerStyle)(Header);
