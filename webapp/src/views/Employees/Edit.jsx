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

import { isObjEmpty } from './../../resources/helpers';

class EditEmployee extends React.Component {
  state = {
    activeTab: 0,
    employee: {},
  }
  updateEmployeeData(data, key) {
    const { employee } = this.state;
    if (isObjEmpty(employee) && key === 'personalData') {
      employee.id = data._id;
    }
    employee[key] = data;
    this.setState({ employee });
  }
  updateEmployeeData = this.updateEmployeeData.bind(this)
  render() {
    const { employee } = this.state;
    const tabStyles = { width: '100%' };
    const disabled = isObjEmpty(employee);

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
              updateEmployeeData={this.updateEmployeeData}
              employee={employee.personalData || {}}
              employeeId={employee.id || null}
            />,
          },
          {
            tabButton: 'Salud',
            disabled,
            tabContent: <HealthForm
              styles={tabStyles}
              updateEmployeeData={this.updateEmployeeData}
              employee={employee.health || {}}
              employeeId={employee.id || null}
            />,
          },
          {
            tabButton: 'Familia',
            disabled,
            tabContent: <FamilyForm
              styles={tabStyles}
              updateEmployeeData={this.updateEmployeeData}
              employee={employee.family || {}}
              employeeId={employee.id || null}
            />,
          },
          {
            tabButton: 'Educación',
            disabled,
            tabContent: <EducationForm
              styles={tabStyles}
              updateEmployeeData={this.updateEmployeeData}
              employee={employee.education || {}}
              employeeId={employee.id || null}
            />,
          },
          {
            tabButton: 'Datos laborales',
            disabled,
            tabContent: <WorkForm
              styles={tabStyles}
              updateEmployeeData={this.updateEmployeeData}
              employee={employee.work || {}}
              employeeId={employee.id || null}
            />,
          },
          {
            tabButton: 'Datos pago',
            disabled,
            tabContent: <PaymentForm
              styles={tabStyles}
              updateEmployeeData={this.updateEmployeeData}
              employee={employee.payment || {}}
              employeeId={employee.id || null}
            />,
          },
        ]}
      />
    );
  }
}

export default withStyles(regularFormsStyle)(EditEmployee);
