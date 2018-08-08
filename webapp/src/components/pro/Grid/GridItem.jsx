import React from 'react';
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';

const style = {
  grid: {
    padding: '0 15px !important',
  },
};

function GridItem({ ...props }) {
  const {
    classes,
    children,
    className,
    ...rest
  } = props;
  return (
    <Grid item {...rest} className={`${classes.grid} ${className}`}>
      {children}
    </Grid>
  );
}

GridItem.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};

GridItem.defaultProps = {
  children: '',
  className: '',
};

export default withStyles(style)(GridItem);
