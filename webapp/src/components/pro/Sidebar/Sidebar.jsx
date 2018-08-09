import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import shortid from 'shortid';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Hidden from '@material-ui/core/Hidden';
import Collapse from '@material-ui/core/Collapse';

// core components
import SidebarWrapper from './SidebarWrapper';
import HeaderLinks from '../../components/Header/HeaderLinks';
import sidebarStyle from '../../assets/jss/material-dashboard-pro-react/components/sidebarStyle';
import avatar from '../../assets/img/faces/avatar.jpg';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openAvatar: false,
      openComponents: this.activeRoute('/components'),
      openForms: this.activeRoute('/forms'),
      openTables: this.activeRoute('/tables'),
      openMaps: this.activeRoute('/maps'),
      openPages: this.activeRoute('-page'),
      miniActive: true,
    };
    this.activeRoute.bind(this);
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1;
  }
  openCollapse(collapse) {
    const st = {};
    st[collapse] = !this.state[collapse];
    this.setState(st);
  }
  render() {
    const {
      classes,
      color,
      logo,
      image,
      logoText,
      routes,
      bgColor,
      rtlActive,
    } = this.props;
    const itemText =
      `${classes.itemText} ${cx({
        [classes.itemTextMini]: this.props.miniActive && this.state.miniActive,
        [classes.itemTextMiniRTL]:
          rtlActive && this.props.miniActive && this.state.miniActive,
        [classes.itemTextRTL]: rtlActive,
      })}`;
    let collapseItemText =
      `${classes.collapseItemText} ${cx({
        [classes.collapseItemTextMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.collapseItemTextMiniRTL]:
          rtlActive && this.props.miniActive && this.state.miniActive,
        [classes.collapseItemTextRTL]: rtlActive,
      })}`;
    const userWrapperClass =
      `${classes.user} ${cx({ [classes.whiteAfter]: bgColor === 'white' })}`;
    let caret =
      `${classes.caret} ${cx({ [classes.caretRTL]: rtlActive })}`;
    const collapseItemMini =
      `${classes.collapseItemMini} ${cx({ [classes.collapseItemMiniRTL]: rtlActive })}`;
    const photo =
      `${classes.photo} ${cx({ [classes.photoRTL]: rtlActive })}`;
    const user = (
      <div className={userWrapperClass}>
        <div className={photo}>
          <img src={avatar} className={classes.avatarImg} alt="..." />
        </div>
        <List className={classes.list}>
          <ListItem className={`${classes.item} ${classes.userItem}`}>
            <NavLink
              to="#"
              className={`${classes.itemLink} ${classes.userCollapseButton}`}
              onClick={() => this.openCollapse('openAvatar')}
            >
              <ListItemText
                primary={rtlActive ? 'تانيا أندرو' : 'Tania Andrew'}
                secondary={
                  <b
                    className={
                      `${caret} ${classes.userCaret} ${this.state.openAvatar ? classes.caretActive : ''}`
                    }
                  />
                }
                disableTypography
                className={`${itemText} ${classes.userItemText}`}
              />
            </NavLink>
            <Collapse in={this.state.openAvatar} unmountOnExit>
              <List className={`${classes.list} ${classes.collapseList}`}>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to="#"
                    className={
                      `${classes.itemLink} ${classes.userCollapseLinks}`
                    }
                  >
                    <span className={collapseItemMini}>
                      {rtlActive ? 'مع' : 'MP'}
                    </span>
                    <ListItemText
                      primary={rtlActive ? 'ملفي' : 'My Profile'}
                      disableTypography
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to="#"
                    className={
                      `${classes.itemLink} ${classes.userCollapseLinks}`
                    }
                  >
                    <span className={collapseItemMini}>
                      {rtlActive ? 'هوع' : 'EP'}
                    </span>
                    <ListItemText
                      primary={
                        rtlActive ? 'تعديل الملف الشخصي' : 'Edit Profile'
                      }
                      disableTypography
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to="#"
                    className={
                      `${classes.itemLink} ${classes.userCollapseLinks}`
                    }
                  >
                    <span className={collapseItemMini}>
                      {rtlActive ? 'و' : 'S'}
                    </span>
                    <ListItemText
                      primary={rtlActive ? 'إعدادات' : 'Settings'}
                      disableTypography
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
              </List>
            </Collapse>
          </ListItem>
        </List>
      </div>
    );
    const links = (
      <List className={classes.list}>
        {routes.map((prop) => {
          const key = shortid.generate();
          if (prop.redirect) {
            return null;
          }
          if (prop.collapse) {
            const navLinkClasses =
              `${classes.itemLink} ${cx({ [` ${classes.collapseActive}`]: this.activeRoute(prop.path) })}`;
            const itemTextRouteParent =
              `${classes.itemText} ${cx({
                [classes.itemTextMini]:
                  this.props.miniActive && this.state.miniActive,
                [classes.itemTextMiniRTL]:
                  rtlActive && this.props.miniActive && this.state.miniActive,
                [classes.itemTextRTL]: rtlActive,
              })}`;
            collapseItemText =
              `${classes.collapseItemText} ${cx({
                [classes.collapseItemTextMini]:
                  this.props.miniActive && this.state.miniActive,
                [classes.collapseItemTextMiniRTL]:
                  rtlActive && this.props.miniActive && this.state.miniActive,
                [classes.collapseItemTextRTL]: rtlActive,
              })}`;
            const itemIcon =
              `${classes.itemIcon} ${cx({ [classes.itemIconRTL]: rtlActive })}`;
            caret =
              `${classes.caret} ${cx({ [classes.caretRTL]: rtlActive })}`;
            return (
              <ListItem key={key} className={classes.item}>
                <NavLink
                  to="#"
                  className={navLinkClasses}
                  onClick={() => this.openCollapse(prop.state)}
                >
                  <ListItemIcon className={itemIcon}>
                    <prop.icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={prop.name}
                    secondary={
                      <b
                        className={
                          `${caret} ${this.state[prop.state] ? classes.caretActive : ''}`
                        }
                      />
                    }
                    disableTypography
                    className={itemTextRouteParent}
                  />
                </NavLink>
                <Collapse in={this.state[prop.state]} unmountOnExit>
                  <List className={`${classes.list} ${classes.collapseList}`}>
                    {prop.views.map((propView) => {
                      const keyView = shortid.generate();
                      if (propView.redirect) {
                        return null;
                      }
                      const navLinkClassesView =
                        `${classes.collapseItemLink} ${cx({
                          [` ${classes[color]}`]: this.activeRoute(propView.path),
                        })}`;
                      const collapseItemMiniView =
                        `${classes.collapseItemMini} ${cx({
                          [classes.collapseItemMiniRTL]: rtlActive,
                        })}`;
                      return (
                        <ListItem key={keyView} className={classes.collapseItem}>
                          <NavLink to={propView.path} className={navLinkClassesView}>
                            <span className={collapseItemMiniView}>
                              {propView.mini}
                            </span>
                            <ListItemText
                              primary={propView.name}
                              disableTypography
                              className={collapseItemText}
                            />
                          </NavLink>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              </ListItem>
            );
          }
          const navLinkClasses =
            `${classes.itemLink} ${cx({
              [` ${classes[color]}`]: this.activeRoute(prop.path),
            })}`;
          const itemTextRoute =
            `${classes.itemText} ${cx({
              [classes.itemTextMini]:
                this.props.miniActive && this.state.miniActive,
              [classes.itemTextMiniRTL]:
                rtlActive && this.props.miniActive && this.state.miniActive,
              [classes.itemTextRTL]: rtlActive,
            })}`;
          const itemIcon =
            `${classes.itemIcon} ${cx({ [classes.itemIconRTL]: rtlActive })}`;
          return (
            <ListItem key={key} className={classes.item}>
              <NavLink to={prop.path} className={navLinkClasses}>
                <ListItemIcon className={itemIcon}>
                  <prop.icon />
                </ListItemIcon>
                <ListItemText
                  primary={prop.name}
                  disableTypography
                  className={itemTextRoute}
                />
              </NavLink>
            </ListItem>
          );
        })}
      </List>
    );

    const logoNormal =
      `${classes.logoNormal} ${cx({
        [classes.logoNormalSidebarMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.logoNormalSidebarMiniRTL]:
          rtlActive && this.props.miniActive && this.state.miniActive,
        [classes.logoNormalRTL]: rtlActive,
      })}`;
    const logoMini =
      `${classes.logoMini} ${cx({ [classes.logoMiniRTL]: rtlActive })}`;
    const logoClasses =
      `${classes.logo} ${cx({ [classes.whiteAfter]: bgColor === 'white' })}`;
    const brand = (
      <div className={logoClasses}>
        <a href="https://www.creative-tim.com" className={logoMini}>
          <img src={logo} alt="logo" className={classes.img} />
        </a>
        <a href="https://www.creative-tim.com" className={logoNormal}>
          {logoText}
        </a>
      </div>
    );
    const drawerPaper =
      `${classes.drawerPaper} ${cx({
        [classes.drawerPaperMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.drawerPaperRTL]: rtlActive,
      })}`;
    const sidebarWrapper =
      `${classes.sidebarWrapper} ${cx({
        [classes.drawerPaperMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.sidebarWrapperWithPerfectScrollbar]:
          navigator.platform.indexOf('Win') > -1,
      })}`;
    const bgColorValue = `${bgColor}Background`;
    return (
      <div>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={rtlActive ? 'left' : 'right'}
            open={this.props.open}
            classes={{
              paper: `${drawerPaper} ${classes[bgColorValue]}`,
            }}
            onClose={this.props.handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {brand}
            <SidebarWrapper
              className={sidebarWrapper}
              user={user}
              headerLinks={<HeaderLinks rtlActive={rtlActive} />}
              links={links}
            />
            {image !== undefined ? (
              <div
                className={classes.background}
                style={{ backgroundImage: `url(${image})` }}
              />
            ) : null}
          </Drawer>
        </Hidden>
        <Hidden smDown>
          <Drawer
            onMouseOver={() => this.setState({ miniActive: false })}
            onFocus={() => this.setState({ miniActive: false })}
            onMouseOut={() => this.setState({ miniActive: true })}
            onBlur={() => this.setState({ miniActive: true })}
            anchor={rtlActive ? 'right' : 'left'}
            variant="permanent"
            open
            classes={{
              paper: `${drawerPaper} ${classes[bgColorValue]}`,
            }}
          >
            {brand}
            <SidebarWrapper
              className={sidebarWrapper}
              user={user}
              links={links}
            />
            {image !== undefined ? (
              <div
                className={classes.background}
                style={{ backgroundImage: `url(${image})` }}
              />
            ) : null}
          </Drawer>
        </Hidden>
      </div>
    );
  }
}

Sidebar.defaultProps = {
  bgColor: 'blue',
  location: {
    pathname: '',
  },
  color: '',
  logo: '',
  image: '',
  logoText: '',
  routes: [{}],
  open: false,
  handleDrawerToggle: () => {},
  miniActive: false,
  rtlActive: false,
};

Sidebar.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  bgColor: PropTypes.oneOf(['white', 'black', 'blue']),
  rtlActive: PropTypes.bool,
  color: PropTypes.oneOf([
    'white',
    'red',
    'orange',
    'green',
    'blue',
    'purple',
    'rose',
  ]),
  logo: PropTypes.string,
  logoText: PropTypes.string,
  image: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  miniActive: PropTypes.bool,
};

export default withStyles(sidebarStyle)(Sidebar);
