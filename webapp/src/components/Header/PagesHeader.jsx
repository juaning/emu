import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import shortid from 'shortid';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

// @material-ui/icons
import Dashboard from '@material-ui/icons/Dashboard';
import Menu from '@material-ui/icons/Menu';

// core components
import Button from '../../components/CustomButtons/Button';

import pagesRoutes from '../../routes/pro/pages';

import pagesHeaderStyle from '../../assets/jss/material-dashboard-pro-react/components/pagesHeaderStyle';

class PagesHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }
  // componentDidUpdate(e) {
  //   if (e.history.location.pathname !== e.location.pathname) {
  //     this.setState({ open: false });
  //   }
  // }
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1;
  }
  handleDrawerToggle = () => {
    this.setState({ open: !this.state.open });
  };
  render() {
    const { classes, color } = this.props;
    const appBarClasses = cx({
      [` ${classes[color]}`]: color,
    });
    const list = (
      <List className={classes.list}>
        <ListItem className={classes.listItem}>
          <NavLink to="/dashboard" className={classes.navLink}>
            <ListItemIcon className={classes.listItemIcon}>
              <Dashboard />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard"
              disableTypography
              className={classes.listItemText}
            />
          </NavLink>
        </ListItem>
        {pagesRoutes.map((prop) => {
          if (prop.redirect) {
            return null;
          }
          const navLink =
            classes.navLink +
            cx({
              [` ${classes.navLinkActive}`]: this.activeRoute(prop.path),
            });
          const key = shortid.generate();
          return (
            <ListItem key={key} className={classes.listItem}>
              <NavLink to={prop.path} className={navLink}>
                <ListItemIcon className={classes.listItemIcon}>
                  <prop.icon />
                </ListItemIcon>
                <ListItemText
                  primary={prop.short}
                  disableTypography
                  className={classes.listItemText}
                />
              </NavLink>
            </ListItem>
          );
        })}
      </List>
    );
    return (
      <AppBar position="static" className={classes.appBar + appBarClasses}>
        <Toolbar className={classes.container}>
          <Hidden smDown implementation="css">
            <div className={classes.flex}>
              <Button href="#" className={classes.title} color="transparent">
                Material Dashboard Pro React
              </Button>
            </div>
          </Hidden>
          <Hidden mdUp>
            <div className={classes.flex}>
              <Button href="#" className={classes.title} color="transparent">
                MD Pro React
              </Button>
            </div>
          </Hidden>
          <Hidden smDown implementation="css">
            {list}
          </Hidden>
          <Hidden mdUp>
            <Button
              className={classes.sidebarButton}
              color="transparent"
              justIcon
              aria-label="open drawer"
              onClick={this.handleDrawerToggle}
            >
              <Menu />
            </Button>
          </Hidden>
          <Hidden mdUp implementation="css">
            <Hidden mdUp>
              <Drawer
                variant="temporary"
                anchor="right"
                open={this.state.open}
                classes={{
                  paper: classes.drawerPaper,
                }}
                onClose={this.handleDrawerToggle}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
              >
                {list}
              </Drawer>
            </Hidden>
          </Hidden>
        </Toolbar>
      </AppBar>
    );
  }
}

PagesHeader.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

PagesHeader.defaultProps = {
  color: 'primary',
  location: {
    pathname: '',
  },
};

export default withStyles(pagesHeaderStyle)(PagesHeader);
