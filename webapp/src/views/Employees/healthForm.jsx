import React from 'react';
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

// core components
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import Button from '../../components/CustomButtons/Button';
import CustomInput from '../../components/CustomInput/CustomInput';
import Card from '../../components/Card/Card';
import CardBody from '../../components/Card/CardBody';

import regularFormsStyle from '../../assets/jss/material-dashboard-pro-react/views/regularFormsStyle';

// API resources
import API from '../../resources/api';
import {
  logError,
  generateMenuItemList,
} from '../../resources/helpers';
import {
  bloodTypeConstant,
  healthInsuranceConstant,
} from '../../resources/constants';

const employeeAPI = new API({ url: '/employee' });
employeeAPI.createEntity({ name: 'health' });

class HealthForm extends React.Component {
  state = {
    entity: {},
  }
  validateField(event, stateName, type) {
    const { value } = event.target;
    const { entity } = this.state;
    entity[type] = value;
  }
  saveClick() {
    const { entity } = this.state;
    employeeAPI
      .endpoints.health
      .create(entity)
      .then(response => response.json())
      .then((data) => {
        const { errors } = data;
        if (errors) {
          logError(errors);
        }
      })
      .catch(error => logError(error));
  }
  render() {
    const { classes } = this.props;
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
                    <Select
                      MenuProps={{
                        className: classes.selectMenu,
                      }}
                      classes={{
                        select: classes.select,
                      }}
                      value=""
                      onChange={this.handleSimple}
                      inputProps={{
                        name: 'blood_type',
                        id: 'blood_type',
                        onChange: event =>
                          this.validateField(event, '', 'blood_type'),
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
                          id="emergency_contact_name"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            placeholder: 'Nombre',
                            onChange: event =>
                              this.validateField(event, '', 'emergency_contact_name'),
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                          id="emergency_contact_number"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            type: 'tel',
                            placeholder: 'Teléfono',
                            onChange: event =>
                              this.validateField(event, '', 'emergency_contact_number'),
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
                    <Select
                      MenuProps={{
                        className: classes.selectMenu,
                      }}
                      classes={{
                        select: classes.select,
                      }}
                      value=""
                      onChange={this.handleSimple}
                      inputProps={{
                        name: 'health_insurance',
                        id: 'health_insurance',
                        onChange: event =>
                          this.validateField(event, '', 'health_insurance'),
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