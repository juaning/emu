import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

import headingStyle from '../../assets/jss/material-dashboard-pro-react/components/headingStyle';

function Heading({ ...props }) {
  const {
    textAlign,
    category,
    title,
    classes,
  } = props;
  const textAlignClass = `${textAlign}TextAlign`;
  const heading =
    `${classes.heading} ${cx({ [classes[textAlignClass]]: textAlign !== undefined })}`;
  if (title !== undefined || category !== undefined) {
    return (
      <div className={heading}>
        {title !== undefined ? (
          <h3 className={classes.title}>{title}</h3>
        ) : null}
        {category !== undefined ? (
          <p className={classes.category}>{category}</p>
        ) : null}
      </div>
    );
  }
  return null;
}

Heading.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  title: PropTypes.node,
  category: PropTypes.node,
  textAlign: PropTypes.oneOf(['right', 'left', 'center']),
};

Heading.defaultProps = {
  title: '',
  category: '',
  textAlign: 'center',
};

export default withStyles(headingStyle)(Heading);
