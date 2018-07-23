import React from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// nodejs library to set properties for components
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
// @material-ui/icons

// core components
import cardBodyStyle from '../../assets/jss/material-dashboard-react/components/cardBodyStyle';

function CardBody({ ...props }) {
  const {
    classes,
    className,
    children,
    plain,
    profile,
    ...rest
  } = props;
  const cardBodyClasses = classNames({
    [classes.cardBody]: true,
    [classes.cardBodyPlain]: plain,
    [classes.cardBodyProfile]: profile,
    [className]: className !== undefined,
  });
  return (
    <div className={cardBodyClasses} {...rest}>
      {children}
    </div>
  );
}

CardBody.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  plain: PropTypes.bool,
  profile: PropTypes.bool,
};

CardBody.defaultProps = {
  className: '',
  children: '',
  plain: false,
  profile: false,
};

export default withStyles(cardBodyStyle)(CardBody);
