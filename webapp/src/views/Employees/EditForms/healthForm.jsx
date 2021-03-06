import React from 'react';
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

// core components
import GridContainer from '../../../components/Grid/GridContainer';
import GridItem from '../../../components/Grid/GridItem';
import Button from '../../../components/CustomButtons/Button';
import CustomInput from '../../../components/CustomInput/CustomInput';
import Card from '../../../components/Card/Card';
import CardBody from '../../../components/Card/CardBody';

import regularFormsStyle from '../../../assets/jss/material-dashboard-pro-react/views/regularFormsStyle';

// API resources
import API from '../../../resources/api';
import {
  logError,
  generateMenuItemList,
} from '../../../resources/helpers';
import {
  bloodTypeConstant,
  healthInsuranceConstant,
} from '../../../resources/constants';

const employeeAPI = new API({ url: '/employee' });
employeeAPI.createEntity({ name: 'health' });

class HealthForm extends React.Component {
  state = {
    healthEntity: {
      employeeId: this.props.employeeId || '',
      bloodType: this.props.employee.bloodType || '',
      alergies: this.props.employee.alergies || '',
      conditions: this.props.employee.conditions || '',
      emergencyContactName: this.props.employee.emergencyContactName || '',
      emergencyContactNumber: this.props.employee.emergencyContactNumber || '',
      healthInsurance: this.props.employee.healthInsurance || '',
      id: this.props.employee._id || null,
    },
  }
  validateField(event, stateName, type) {
    const { value } = event.target;
    const { healthEntity } = this.state;
    healthEntity[type] = value;
    this.setState({ healthEntity });
  }
  validateField = this.validateField.bind(this);
  saveClick() {
    const { healthEntity } = this.state;
    let promise;
    if (healthEntity.id) {
      promise = employeeAPI.endpoints.health.update(healthEntity);
    } else {
      promise = employeeAPI.endpoints.health.create(healthEntity)
    }
    promise
      .then(response => response.json())
      .then((data) => {
        const { errors, errmsg } = data;
        if (errors || errmsg) {
          const err = errors ? errors : errmsg;
          logError(err);
          return;
        }
        this.props.updateEmployeeData(data, 'health');
      })
      .catch(error => logError(error));
  }
  saveClick = this.saveClick.bind(this);
  render() {
    const { classes } = this.props;
    const { healthEntity } = this.state;
    const bloodTypeOptions = generateMenuItemList(bloodTypeConstant, classes);
    const healthInsuranceOptions = generateMenuItemList(healthInsuranceConstant, classes);
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <form>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Tipo de sangre
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <FormControl fullWidth className={classes.formControlCustomInput}>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu,
                        }}
                        classes={{
                          select: classes.select,
                        }}
                        value={healthEntity.bloodType}
                        inputProps={{
                          name: 'bloodType',
                          id: 'bloodType',
                          onChange: (event) => 
                            this.validateField(event, '', 'bloodType'),
                        }}
                        autoWidth
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem,
                          }}
                        >
                          Tipo de sangre
                        </MenuItem>
                        {bloodTypeOptions}
                      </Select>
                    </FormControl>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Alergias
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="alergies"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: event =>
                          this.validateField(event, 'registerAlergies', 'alergies'),
                        type: 'text',
                        name: 'alergies',
                        value: healthEntity.alergies,
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Enfermedades
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="conditions"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: event =>
                          this.validateField(event, 'registerConditions', 'conditions'),
                        type: 'text',
                        name: 'conditions',
                        value: healthEntity.conditions,
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Contacto de emergencia
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                          id="emergencyContactName"
                          labelText="Nombre"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            onChange: event =>
                              this.validateField(event, '', 'emergencyContactName'),
                            value: healthEntity.emergencyContactName
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                          id="emergencyContactNumber"
                          labelText="Teléfono"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            type: 'tel',
                            onChange: event =>
                              this.validateField(event, '', 'emergencyContactNumber'),
                            value: healthEntity.emergencyContactNumber
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Seguro medico
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <FormControl fullWidth className={classes.formControlCustomInput}>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu,
                        }}
                        classes={{
                          select: classes.select,
                        }}
                        value={healthEntity.healthInsurance}
                        inputProps={{
                          name: 'healthInsurance',
                          id: 'healthInsurance',
                          onChange: (event) => 
                            this.validateField(event, '', 'healthInsurance'),
                        }}
                        autoWidth
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem,
                          }}
                        >
                          Seguro medico
                        </MenuItem>
                        {healthInsuranceOptions}
                      </Select>
                    </FormControl>
                  </GridItem>
                </GridContainer>
                <GridContainer justify="flex-end">
                  <GridItem xs={12} sm={2} className="right">
                    <Button
                      color="rose"
                      onClick={this.saveClick}
                      className={classes.registerButton}
                    >
                      Guardar
                    </Button>
                  </GridItem>
                </GridContainer>
              </form>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

HealthForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(regularFormsStyle)(HealthForm);