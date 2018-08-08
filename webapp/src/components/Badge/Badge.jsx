import React from 'react';
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

import badgeStyle from '../../assets/jss/material-dashboard-pro-react/components/badgeStyle';

function Badge({ ...props }) {
  const { classes, color, children } = props;
  return (
    <span className={`${classes.badge} ${classes[color]}`}>{children}</span>
  );
}

Badge.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  color: PropTypes.oneOf([
    'primary',
    'warning',
    'danger',
    'success',
    'info',
    'rose',
    'gray',
  ]),
  children: PropTypes.node,
};

Badge.defaultProps = {
  color: 'primary',
  children: '',
};

export default withStyles(badgeStyle)(Badge);
