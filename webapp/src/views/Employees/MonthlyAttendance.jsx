import React from 'react';
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';

import regularFormsStyle from '../../assets/jss/material-dashboard-pro-react/views/regularFormsStyle';

class MonthlyAttendanceForm extends React.Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
  }
}

export default withStyles(regularFormsStyle)(MonthlyAttendanceForm);