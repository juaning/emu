import React from 'react';
// import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

import NavPills from '../../components/NavPills/NavPills';

import regularFormsStyle from '../../assets/jss/material-dashboard-pro-react/views/regularFormsStyle';

import PersonalDataForm from './personalDataForm';
import HealthForm from './healthForm';

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

    return (
      <NavPills
        color="rose"
        style={{ width: '100%' }}
        scrollable
        scrollButtons="on"
        tabs={[
          {
            tabButton: 'Datos personales',
            tabContent: <PersonalDataForm styles={{ width: '100%' }} UpdateRedirect={this.updateRedirectToList} />,
          },
          {
            tabButton: 'Salud',
            tabContent: <HealthForm styles={{ width: '100%' }} />,
          },
          {
            tabButton: 'Familia',
            tabContent: (<div><span>Familia</span></div>),
          },
          {
            tabButton: 'Educación',
            tabContent: (<div><span>Educación</span></div>),
          },
          {
            tabButton: 'Datos laborales',
            tabContent: (<div><span>Datos laborales</span></div>),
          },
          {
            tabButton: 'Adjuntos',
            tabContent: (<div><span>Adjuntos</span></div>),
          },
          {
            tabButton: 'Datos pago',
            tabContent: (<div><span>Datos Pago</span></div>),
          },
        ]}
      />
    );

    // return <PersonalDataPartial UpdateRedirect={this.updateRedirectToList} />;
  }
}

export default withStyles(regularFormsStyle)(EditEmployee);
