import React from 'react';
// import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

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
            tabContent: <WorkForm styles={tabStyles} employee={this.state.employee} />,
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
