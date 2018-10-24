import React from 'react';
// import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

import NavPills from '../../components/NavPills/NavPills';

import regularFormsStyle from '../../assets/jss/material-dashboard-pro-react/views/regularFormsStyle';

import PersonalDataForm from './personalDataForm';
import HealthForm from './healthForm';
import FamilyForm from './familyForm';
import EducationForm from './educationForm';
import PaymentForm from './paymentForm';

class EditEmployee extends React.Component {
  state = {
    redirectToList: false,
    employee: {},
  }
  updateRedirectToList(redirectToList, employeeId) {
    const employee = { id: employeeId };
    this.setState({ employee });
  }
  updateRedirectToList = this.updateRedirectToList.bind(this)
  render() {
    if (this.state.redirectToList) {
      return <Redirect to="/empleados/lista" />;
    }

    const tabStyles = { width: '100%' };

    return (
      <NavPills
        color="rose"
        direction="x"
        tabs={[
          {
            tabButton: 'Datos personales',
            tabContent: <PersonalDataForm
              styles={tabStyles}
              UpdateRedirect={this.updateRedirectToList}
            />,
          },
          {
            tabButton: 'Salud',
            tabContent: <HealthForm styles={tabStyles} employee={this.state.employee} />,
          },
          {
            tabButton: 'Familia',
            tabContent: <FamilyForm styles={tabStyles} employee={this.state.employee} />,
          },
          {
            tabButton: 'Educación',
            tabContent: <EducationForm styles={tabStyles} employee={this.state.employee} />,
          },
          {
            tabButton: 'Datos laborales',
            tabContent: (<div><span>Datos laborales</span></div>),
          },
          // {
          //   tabButton: 'Adjuntos',
          //   tabContent: (<div><span>Adjuntos</span></div>),
          // },
          {
            tabButton: 'Datos pago',
            tabContent: <PaymentForm styles={tabStyles} employee={this.state.employee} />,
          },
        ]}
      />
    );
  }
}

export default withStyles(regularFormsStyle)(EditEmployee);
