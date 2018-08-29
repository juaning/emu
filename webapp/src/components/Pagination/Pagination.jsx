import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import shortid from 'shortid';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';

import paginationStyle from '../../assets/jss/material-dashboard-pro-react/components/paginationStyle';

function Pagination({ ...props }) {
  const { classes, pages, color } = props;
  return (
    <ul className={classes.pagination}>
      {pages.map((prop) => {
        const paginationLink = cx({
          [classes.paginationLink]: true,
          [classes[color]]: prop.active,
          [classes.disabled]: prop.disabled,
        });
        const key = shortid.generate();
        return (
          <li className={classes.paginationItem} key={key}>
            {prop.onClick !== undefined ? (
              <Button onClick={prop.onClick} className={paginationLink}>
                {prop.text}
              </Button>
            ) : (
              <Button
                onClick={() => console.log(`you've clicked ${prop.text}`)}
                className={paginationLink}
              >
                {prop.text}
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
}

Pagination.defaultProps = {
  color: 'primary',
};

Pagination.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  pages: PropTypes.arrayOf(PropTypes.shape({
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    text: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.oneOf(['PREV', 'NEXT', '...']),
    ]).isRequired,
    onClick: PropTypes.func,
  })).isRequired,
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']),
};

export default withStyles(paginationStyle)(Pagination);
