import React from 'react';
import PropTypes from 'prop-types';
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from 'perfect-scrollbar';
// import { NavLink } from 'react-router-dom';
// import cx from 'classnames';

// @material-ui/core components
// import withStyles from '@material-ui/core/styles/withStyles';
// import Drawer from '@material-ui/core/Drawer';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import Hidden from '@material-ui/core/Hidden';
// import Collapse from '@material-ui/core/Collapse';

let ps;

// We've created this component so we can have a ref to the wrapper of the
// links that appears in our sidebar.
// This was necessary so that we could initialize PerfectScrollbar on the links.
// There might be something with the Hidden component from material-ui, and we
// didn't have access to
// the links, and couldn't initialize the plugin.
class SidebarWrapper extends React.Component {
  componentDidMount() {
    if (navigator.platform.indexOf('Win') > -1) {
      ps = new PerfectScrollbar(this.sidebarWrapperRef.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf('Win') > -1) {
      ps.destroy();
    }
  }
  sidebarWrapperRef = React.createRef();
  render() {
    const {
      className,
      user,
      headerLinks,
      links,
    } = this.props;
    return (
      <div className={className} ref={this.sidebarWrapperRef}>
        {user}
        {headerLinks}
        {links}
      </div>
    );
  }
}

SidebarWrapper.propTypes = {
  className: PropTypes.string,
  user: PropTypes.node,
  headerLinks: PropTypes.node,
  links: PropTypes.node,
};

SidebarWrapper.defaultProps = {
  className: '',
  user: '',
  headerLinks: '',
  links: '',
};

export default SidebarWrapper;
