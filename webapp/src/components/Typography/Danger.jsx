import React from 'react';
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

import typographyStyle from '../../assets/jss/material-dashboard-pro-react/components/typographyStyle';

function Danger({ ...props }) {
  const { classes, children } = props;
  return (
    <div className={`${classes.defaultFontStyle} ${classes.dangerText}`}>
      {children}
    </div>
  );
}

Danger.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  children: PropTypes.node,
};

Danger.defaultProps = {
  children: '',
};

export default withStyles(typographyStyle)(Danger);
