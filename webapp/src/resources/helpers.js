import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';

function verifyEmail(value) {
  const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRex.test(value);
}

function verifyPhoneNumber(value) {
  // const numberRex = new RegExp('[0-9]{3}-[0-9]{3}-[0-9]{3}');
  const numberRex = new RegExp('^([0|\\+[0-9]{1,5})?([0|9][0-9]{8})$]');
  return numberRex.test(value);
}

function addDashesToPhoneNumber(value) {
  return `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
}

function logError(error) {
  /* eslint no-console: ["error", { allow: ["error"] }] */
  console.error(error);
}

function generateMenuItemList(list, classes) {
  const menuList = list.map(item => (
    <MenuItem
      key={item.value}
      classes={{
        root: classes.selectMenuItem,
        selected: classes.selectMenuItemSelected,
      }}
      value={item.value}
    >
      {item.text}
    </MenuItem>
  ));
  return menuList;
}

function generateMenuWithNumbers(top) {
  return Array(top + 1).fill().map((item, i) => ({ value: i, text: i }));
}

function calculateOffDays(obj, field) {
  return Object.entries(obj) // eslint-disable-next-line
    .reduce((accu, [key, item]) => (item[field] ? accu + (item.days * 1) : accu), 0);
}

function calculateExtraHours(obj) {
  return Object.entries(obj) // eslint-disable-next-line
    .reduce((accu, [key, item]) => key !== 'total' ? accu + (item * 1) : accu, 0);
}

export {
  verifyEmail,
  verifyPhoneNumber,
  addDashesToPhoneNumber,
  logError,
  generateMenuItemList,
  generateMenuWithNumbers,
  calculateOffDays,
  calculateExtraHours,
};
