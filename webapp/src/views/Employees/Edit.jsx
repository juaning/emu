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
// API resources
import API from '../../resources/api';

const employeeAPI = new API({ url: '/employee' });
employeeAPI.createEntity({ name: 'personal-data' });
employeeAPI.createEntity({ name: 'health' });
employeeAPI.createEntity({ name: 'family' });
employeeAPI.createEntity({ name: 'education' });
employeeAPI.createEntity({ name: 'work' });
employeeAPI.createEntity({ name: 'payment' });

class EditEmployee extends React.Component {
  state = {
    activeTab: 0,
    employee: {
      id: (() => {
        const { location } = this.props;
        const query = new URLSearchParams(location.search);
        return query.get('empleado');
      })(),
    },
  }
  getEmployeeIdFromURL = () => {
    const { location } = this.props;
    const query = new URLSearchParams(location.search);
    return query.get('empleado');
  }
  componentDidMount() {
    const { employee } = this.state;
    if (employee.id) {
      employeeAPI.endpoints['personal-data'].getOne({ id: employee.id })
        .then(results => results.json())
        .then(data => {
          this.updateEmployeeData(data, 'personalData');
          const promises = [];
          const id = `employee/${employee.id}/latest`;
          promises.push(employeeAPI.endpoints.health.getOne({ id }));
          promises.push(employeeAPI.endpoints.family.getOne({ id }));
          promises.push(employeeAPI.endpoints.education.getOne({ id }));
          promises.push(employeeAPI.endpoints.work.getOne({
            id: `employee/${employee.id}/current`,
          }));
          promises.push(employeeAPI.endpoints.payment.getOne({ id }));
          return Promise.all(promises);
        })
        .then(results => Promise.all(results.map(result => result.json())))
        .then(([healthData, familyData, educationData, workData, paymentData]) => {
          this.updateEmployeeData(healthData, 'health');
          this.updateEmployeeData(familyData, 'family');
          this.updateEmployeeData(educationData, 'education');
          this.updateEmployeeData(workData, 'work');
          this.updateEmployeeData(paymentData, 'payment');
        })
        .catch(err => console.error(err));
    }
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
    const disabled = employee.id === null;

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
            // disabled,
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
