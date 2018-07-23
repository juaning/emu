import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Snack from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
// @material-ui/icons
import Close from '@material-ui/icons/Close';
// core components
import snackbarContentStyle from '../../assets/jss/material-dashboard-react/components/snackbarContentStyle';

function Snackbar({ ...props }) {
  const {
    classes,
    message,
    color,
    close,
    icon,
    place,
    open,
  } = props;
  let action = [];
  const messageClasses = classNames({
    [classes.iconMessage]: icon !== undefined,
  });
  if (close !== undefined) {
    action = [
      <IconButton
        className={classes.iconButton}
        key="close"
        aria-label="Close"
        color="inherit"
        onClick={() => props.closeNotification()}
      >
        <Close className={classes.close} />
      </IconButton>,
    ];
  }
  const leftVal = place.indexOf('c') !== -1 ? 'center' : 'right';
  return (
    <Snack
      anchorOrigin={{
        vertical: place.indexOf('t') === -1 ? 'bottom' : 'top',
        horizontal: place.indexOf('l') !== -1
          ? 'left'
          : leftVal,
      }}
      open={open}
      message={
        <div>
          {icon !== undefined ? <props.icon className={classes.icon} /> : null}
          <span className={messageClasses}>{message}</span>
        </div>
      }
      action={action}
      ContentProps={{
        classes: {
          root: `${classes.root} ${classes[color]}`,
          message: classes.message,
        },
      }}
    />
  );
}

Snackbar.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  message: PropTypes.node.isRequired,
  color: PropTypes.oneOf([
    'info',
    'success',
    'warning',
    'danger',
    'primary',
  ]),
  close: PropTypes.bool,
  icon: PropTypes.func,
  place: PropTypes.oneOf([
    'tl',
    'tr',
    'tc',
    'br',
    'bl',
    'bc',
  ]),
  open: PropTypes.bool,
  closeNotification: PropTypes.func,
};

Snackbar.defaultProps = {
  color: 'primary',
  close: false,
  icon: () => {},
  place: 'tl',
  open: false,
  closeNotification: () => {},
};

export default withStyles(snackbarContentStyle)(Snackbar);
