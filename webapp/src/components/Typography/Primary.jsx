import React from 'react';
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

import typographyStyle from '../../assets/jss/material-dashboard-pro-react/components/typographyStyle';

function Primary({ ...props }) {
  const { classes, children } = props;
  return (
    <div className={`${classes.defaultFontStyle} ${classes.primaryText}`}>
      {children}
    </div>
  );
}

Primary.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  children: PropTypes.node,
};

Primary.defaultProps = {
  children: '',
};

export default withStyles(typographyStyle)(Primary);
