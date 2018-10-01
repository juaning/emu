import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

import footerStyle from '../../assets/jss/material-dashboard-pro-react/components/footerStyle';

function Footer({ ...props }) {
  const {
    classes,
    fluid,
    white,
  } = props;
  const container = cx({
    [classes.container]: !fluid,
    [classes.containerFluid]: fluid,
    [classes.whiteColor]: white,
  });
  const anchor =
    classes.a +
    cx({
      [` ${classes.whiteColor}`]: white,
    });
  return (
    <footer className={classes.footer}>
      <div className={container}>
        <p className={classes.right}>
          &copy; {1900 + new Date().getYear()}{' '}
          <a href="https://www.folkpy.com/" className={anchor}>
            Folk Py
          </a>
          &nbsp;hecho con ❤ por
          <a href="https://fioar04.wixsite.com/omicronepm" className={anchor}>
          &nbsp;OmicronEPM
          </a>
        </p>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  fluid: PropTypes.bool,
  white: PropTypes.bool,
};

Footer.defaultProps = {
  fluid: false,
  white: false,
};

export default withStyles(footerStyle)(Footer);
