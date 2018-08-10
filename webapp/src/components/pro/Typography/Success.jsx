import React from 'react';
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

import typographyStyle from '../../assets/jss/material-dashboard-pro-react/components/typographyStyle';

function Success({ ...props }) {
  const { classes, children } = props;
  return (
    <div className={`${classes.defaultFontStyle} ${classes.successText}`}>
      {children}
    </div>
  );
}

Success.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  children: PropTypes.node,
};

Success.defaultProps = {
  children: '',
};

export default withStyles(typographyStyle)(Success);
