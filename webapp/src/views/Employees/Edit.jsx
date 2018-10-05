import React from 'react';
// import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
// react component plugin for creating a beautiful datetime dropdown picker

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

import regularFormsStyle from '../../assets/jss/material-dashboard-pro-react/views/regularFormsStyle';

import PersonalDataPartial from './personalDataForm';

class EditEmployee extends React.Component {
  state = {
    redirectToList: false,
  }
  updateRedirectToList(redirectToList) {
    this.setState({ redirectToList });
  }
  updateRedirectToList = this.updateRedirectToList.bind(this)
  render() {
    if (this.state.redirectToList) {
      return <Redirect to="/empleados/lista" />;
    }

    return <PersonalDataPartial UpdateRedirect={this.updateRedirectToList} />;
  }
}

export default withStyles(regularFormsStyle)(EditEmployee);
