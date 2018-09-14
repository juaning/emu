import React from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// nodejs library to set properties for components
import PropTypes from 'prop-types';
import { Manager, Reference, Popper } from 'react-popper';
import shortid from 'shortid';

// material-ui components
import withStyles from '@material-ui/core/styles/withStyles';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Grow from '@material-ui/core/Grow';
import Divider from '@material-ui/core/Divider';

// core components
import Button from '../../components/CustomButtons/Button';

import customDropdownStyle from '../../assets/jss/material-dashboard-pro-react/components/customDropdownStyle';

class CustomDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleClick() {
    this.setState({ open: true });
  }
  handleClose() {
    this.setState({ open: false });
  }
  render() {
    const { open } = this.state;
    const {
      classes,
      buttonText,
      buttonIcon,
      dropdownList,
      buttonProps,
      dropup,
      dropdownHeader,
      caret,
      hoverColor,
      left,
      rtlActive,
    } = this.props;
    const caretClasses = classNames({
      [classes.caret]: true,
      [classes.caretDropup]: dropup && !open,
      [classes.caretActive]: open && !dropup,
      [classes.caretRTL]: rtlActive,
    });
    const dropdownItem = classNames({
      [classes.dropdownItem]: true,
      [classes[`${hoverColor}Hover`]]: true,
      [classes.dropdownItemRTL]: rtlActive,
    });
    const topPosition = left ? 'top-end' : 'top-start';
    const bottomPosition = left ? 'bottom-end' : 'bottom-start';
    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <Button
              ref={ref}
              aria-label="Notifications"
              aria-owns={open ? 'menu-list' : null}
              aria-haspopup="true"
              {...buttonProps}
              onClick={this.handleClick}
            >
              {buttonIcon !== undefined ? (
                <this.props.buttonIcon className={classes.buttonIcon} />
              ) : null}
              {buttonText !== undefined ? buttonText : null}
              {caret ? <b className={caretClasses} /> : null}
            </Button>
          )}
        </Reference>
        <Popper
          placement={
            dropup
              ? topPosition
              : bottomPosition
          }
          eventsEnabled={open}
          className={classNames({
            [classes.popperClose]: !open,
            [classes.pooperResponsive]: true,
          })}
        >
          {({ ref, placement }) => (
            <div
              ref={ref}
              className={classNames(
                { [classes.popperClose]: !open },
                { [classes.pooperResponsive]: true },
              )}
              style={{
                position: 'absolute',
                willChange: 'transform',
              }}
              data-placement={placement}
            >
              <ClickAwayListener onClickAway={this.handleClose}>
                <Grow
                  in={open}
                  id="menu-list"
                  style={
                    dropup
                      ? { transformOrigin: '0 100% 0' }
                      : { transformOrigin: '0 0 0' }
                  }
                >
                  <Paper className={classes.dropdown}>
                    <MenuList role="menu" className={classes.menuList}>
                      {dropdownHeader !== undefined ? (
                        <MenuItem
                          onClick={this.handleClose}
                          className={classes.dropdownHeader}
                        >
                          {dropdownHeader}
                        </MenuItem>
                      ) : null}
                      {dropdownList.map((prop) => {
                        const key = shortid.generate();
                        if (prop.divider) {
                          return (
                            <Divider
                              key={key}
                              onClick={this.handleClose}
                              className={classes.dropdownDividerItem}
                            />
                          );
                        }
                        return (
                          <MenuItem
                            key={key}
                            onClick={this.handleClose}
                            className={dropdownItem}
                          >
                            {prop.text}
                          </MenuItem>
                        );
                      })}
                    </MenuList>
                  </Paper>
                </Grow>
              </ClickAwayListener>
            </div>
          )}
        </Popper>
      </Manager>
    );
  }
}

CustomDropdown.defaultProps = {
  caret: true,
  hoverColor: 'primary',
  buttonText: '',
  buttonIcon: '',
  dropdownList: [],
  buttonProps: {},
  dropup: false,
  dropdownHeader: '',
  rtlActive: false,
  left: false,
};

CustomDropdown.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  hoverColor: PropTypes.oneOf(['primary', 'black']),
  buttonText: PropTypes.node,
  buttonIcon: PropTypes.string,
  dropdownList: PropTypes.arrayOf(PropTypes.shape({})),
  buttonProps: PropTypes.shape({}),
  dropup: PropTypes.bool,
  dropdownHeader: PropTypes.node,
  rtlActive: PropTypes.bool,
  caret: PropTypes.bool,
  left: PropTypes.bool,
};

export default withStyles(customDropdownStyle)(CustomDropdown);
