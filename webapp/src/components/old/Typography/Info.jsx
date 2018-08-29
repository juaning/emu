import React from 'react';
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
// core components
import typographyStyle from '../../assets/jss/material-dashboard-react/components/typographyStyle';

function Info({ ...props }) {
  const { classes, children } = props;
  return (
    <div className={`${classes.defaultFontStyle} ${classes.infoText}`}>
      {children}
    </div>
  );
}

Info.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  children: PropTypes.node,
};

Info.defaultProps = {
  children: '',
};

export default withStyles(typographyStyle)(Info);
