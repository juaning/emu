import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
// react component plugin for creating a beautiful datetime dropdown picker
import Datetime from 'react-datetime';

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
import CardHeader from '../../components/Card/CardHeader';
import CardText from '../../components/Card/CardText';
import CardBody from '../../components/Card/CardBody';

// API resources
import API from '../../resources/api';

import regularFormsStyle from '../../assets/jss/material-dashboard-pro-react/views/regularFormsStyle';
import {
  datesConstant,
  maritalStatusConstant,
  countryListConstant,
  genderListConstant,
} from '../../resources/constants';
import {
  logError,
  verifyEmail,
  verifyPhoneNumber,
  // addDashesToPhoneNumber,
} from '../../resources/helpers';

const employeeAPI = new API({ url: '' });
employeeAPI.createEntity({ name: 'personal-data' });

const { startingDOBDate, dateFormat } = datesConstant;

class EditEmployee extends React.Component {
  state = {
    redirectToDashboard: false,
    registerEmailState: '',
    registerPhoneState: '',
    entity: {},
  }
  onPhoneChange(event, stateName, type) {
    // const key = event.which || event.keyCode || event.charCode;
    // if (key !== 8 && key !== 46) {
    //   const trimmedVal = event.target.value.replace(/\D[^\.]/g, '');
    //   const formatedNumber = addDashesToPhoneNumber(trimmedVal);
    //   console.log(formatedNumber);
    //   event.target.value = formatedNumber;
    // }
    this.validateField(event, stateName, type);
  }
  onPhoneChange = this.onPhoneChange.bind(this)
  onDOBChange(momentObj, stateName, type) {
    const event = {
      target: {
        value: momentObj.format('YYYY-MM-D'),
      },
    };
    this.validateField(event, stateName, type);
  }
  onDOBChange = this.onDOBChange.bind(this)
  generateMenuItemList(list) {
    const classes = this.props;
    const menuList = list.map(item => (
      <MenuItem
        key={item.value}
        classes={{
          root: classes.selectMenuItem,
          selected: classes.selectMenuItemSelected,
        }}
        value={item.value}
      >
        {item.text}
      </MenuItem>
    ));
    return menuList;
  }
  validateField(event, stateName, type) {
    let state;
    if (event.target.value.trim().length === 0) {
      state = '';
    } else {
      const { value } = event.target;
      const { entity } = this.state;
      switch (type) {
        case 'email':
          state = verifyEmail(value) ? 'success' : 'error';
          break;
        case 'phone':
          state = verifyPhoneNumber(value) ? 'success' : 'error';
          break;
        default:
      }
      entity[type] = value;
      this.setState({ entity });
    }
    this.setState({ [`${stateName}State`]: state });
  }
  validateField = this.validateField.bind(this)
  handleSimple(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  handleSimple = this.handleSimple.bind(this)
  saveClick() {
    const { entity } = this.state;
    employeeAPI.endpoints['personal-data'].create(entity)
      .then(response => response.json())
      .then((data) => {
        const { errors } = data;
        if (errors) {
          logError(errors);
          return;
        }
        this.setState({ redirectToDashboard: true });
      })
      .catch(error => logError(error));
  }
  saveClick = this.saveClick.bind(this);
  render() {
    if (this.state.redirectToDashboard) {
      return <Redirect to="/empleados/lista" />;
    }
    const { classes } = this.props;
    const maritalStatusOptions = this.generateMenuItemList(maritalStatusConstant);
    const countryListOptions = this.generateMenuItemList(countryListConstant);
    const genderListOptions = this.generateMenuItemList(genderListConstant);
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="rose" text>
              <CardText color="rose">
                <h4 className={classes.cardTitle}>Datos Empleado</h4>
              </CardText>
            </CardHeader>
            <CardBody>
              <form>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Documento de Identidad
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="documentId"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        name: 'documentId',
                        id: 'documentId',
                        onChange: event =>
                          this.validateField(event, '', 'documentId'),
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Nombre
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="firstName"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        name: 'firstName',
                        id: 'firstName',
                        onChange: event =>
                          this.validateField(event, '', 'firstName'),
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Apellido
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="lastName"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        name: 'lastName',
                        id: 'lastName',
                        onChange: event =>
                          this.validateField(event, '', 'lastName'),
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Fecha de Nacimiento
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    {/* TODO: add classes to match padding */}
                    <Datetime
                      id="DOB"
                      timeFormat={false}
                      dateFormat={dateFormat}
                      viewDate={startingDOBDate}
                      inputProps={{
                        name: 'DOB',
                        id: 'DOB',
                      }}
                      onChange={momentObj =>
                          this.onDOBChange(momentObj, '', 'DOB')}
                      closeOnSelect
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Estado Civil
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
                        name: 'maritalStatus',
                        id: 'maritalStatus',
                        onChange: event =>
                          this.validateField(event, '', 'maritalStatus'),
                      }}
                      autoWidth
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem,
                        }}
                      >
                        Elegir Estado Civil
                      </MenuItem>
                      {maritalStatusOptions}
                    </Select>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Direcci&oacute;n
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="address"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        name: 'address',
                        id: 'address',
                        onChange: event =>
                          this.validateField(event, '', 'address'),
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Tel&eacute;fono
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="phone"
                      success={this.state.registerPhoneState === 'success'}
                      error={this.state.registerPhoneState === 'error'}
                      labelText="981-123-456"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        type: 'tel',
                        name: 'phone',
                        onChange: event =>
                          this.onPhoneChange(event, 'registerPhone', 'phone'),
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Nacionalidad
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
                        name: 'nationality',
                        id: 'nationality',
                        onChange: event =>
                          this.validateField(event, '', 'nationality'),
                      }}
                      autoWidth
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem,
                        }}
                      >
                        Nacionalidad
                      </MenuItem>
                      {countryListOptions}
                    </Select>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      G&eacute;nero
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
                        name: 'gender',
                        id: 'gender',
                        onChange: event =>
                          this.validateField(event, '', 'gender'),
                      }}
                      autoWidth
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem,
                        }}
                      >
                        G&eacute;nero
                      </MenuItem>
                      {genderListOptions}
                    </Select>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      E-mail
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      success={this.state.registerEmailState === 'success'}
                      error={this.state.registerEmailState === 'error'}
                      labelText="usuario@email.com"
                      id="email"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: event =>
                          this.validateField(event, 'registerEmail', 'email'),
                        type: 'email',
                        name: 'email',
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer justify="flex-end">
                  <GridItem xs={12} sm={2}>
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

EditEmployee.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(regularFormsStyle)(EditEmployee);
