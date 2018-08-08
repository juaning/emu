import React from 'react';
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '@material-ui/core/LinearProgress';

import customLinearProgressStyle from '../../assets/jss/material-dashboard-pro-react/components/customLinearProgressStyle';

function CustomLinearProgress({ ...props }) {
  const { classes, color, ...rest } = props;
  const backgroundColor = `${color}Background`;
  return (
    <LinearProgress
      {...rest}
      classes={{
        root: `${classes.root} ${classes[backgroundColor]}`,
        bar: `${classes.bar} ${classes[color]}`,
      }}
    />
  );
}

CustomLinearProgress.defaultProps = {
  color: 'gray',
};

CustomLinearProgress.propTypes = {
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
};

export default withStyles(customLinearProgressStyle)(CustomLinearProgress);
