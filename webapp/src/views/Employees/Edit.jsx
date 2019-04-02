import React from 'react';
// import PropTypes from 'prop-types';
// import { Redirect } from 'react-router-dom';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

import NavPills from '../../components/NavPills/NavPills';

import regularFormsStyle from '../../assets/jss/material-dashboard-pro-react/views/regularFormsStyle';

import PersonalDataForm from './EditForms/personalDataForm';
import HealthForm from './EditForms/healthForm';
import FamilyForm from './EditForms/familyForm';
import EducationForm from './EditForms/educationForm';
import PaymentForm from './EditForms/paymentForm';
import WorkForm from './EditForms/workForm';

class EditEmployee extends React.Component {
  state = {
    activeTab: 0,
    redirectToList: false,
    employee: {
      id: false,
    },
  }
  updateRedirectToList(redirectToList, employeeId) {
    const employee = { id: employeeId };
    this.setState({ employee });
  }
  updateRedirectToList = this.updateRedirectToList.bind(this)
  render() {
    const { employee } = this.state;
    const tabStyles = { width: '100%' };
    const disabled = employee.id === false;

    return (
      <NavPills
        color="rose"
        direction="x"
        active={this.state.activeTab}
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
            disabled,
            tabContent: <HealthForm styles={tabStyles} employee={this.state.employee} />,
          },
          {
            tabButton: 'Familia',
            disabled,
            tabContent: <FamilyForm styles={tabStyles} employee={this.state.employee} />,
          },
          {
            tabButton: 'Educación',
            disabled,
            tabContent: <EducationForm styles={tabStyles} employee={this.state.employee} />,
          },
          {
            tabButton: 'Datos laborales',
            disabled,
            tabContent: <WorkForm styles={tabStyles} employee={this.state.employee} />,
          },
          // {
          //   tabButton: 'Adjuntos',
          //   disabled,
          //   tabContent: (<div><span>Adjuntos</span></div>),
          // },
          {
            tabButton: 'Datos pago',
            disabled,
            tabContent: <PaymentForm styles={tabStyles} employee={this.state.employee} />,
          },
        ]}
      />
    );
  }
}

export default withStyles(regularFormsStyle)(EditEmployee);
