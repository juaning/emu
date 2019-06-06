import React from 'react';
import PropTypes from 'prop-types';
// react component plugin for creating a beautiful datetime dropdown picker
import Datetime from 'react-datetime';

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
  datesConstant,
  maritalStatusConstant,
  countryListConstant,
  genderListConstant,
} from '../../../resources/constants';

import {
  logError,
  verifyEmail,
  verifyPhoneNumber,
  generateMenuItemList,
} from '../../../resources/helpers';

const employeeAPI = new API({ url: '/employee' });
employeeAPI.createEntity({ name: 'personal-data' });

const { startingDOBDate, dateFormat, dateFormatDB } = datesConstant;

class PersonalDataForm extends React.Component {
  state = {
    registerEmailState: '',
    registerPhoneState: '',
    documentIdState: '',
    entity: {
      ...this.props.employee
    },
    entityId: this.props.employeeId,
  }
  onPhoneChange(event, stateName, type) {
    this.validateField(event, stateName, type);
  }
  onPhoneChange = this.onPhoneChange.bind(this)
  onDOBChange(momentObj, stateName, type) {
    const event = {
      target: {
        value: momentObj.format(dateFormatDB),
      },
    };
    this.validateField(event, stateName, type);
  }
  onDOBChange = this.onDOBChange.bind(this)
  checkIfRequired(event, stateName, type) {
    const { value } = event.target;
    let state;
    switch (type) {
      case 'documentId':
        state = value.trim().length > 0 ? 'success' : 'error';
        break;
      default:
    }
    this.setState({ [`${stateName}State`]: state });
    this.validateField(event, stateName, type);
  }
  checkIfRequired = this.checkIfRequired.bind(this)
  validateField(event, stateName, type) {
    let state = '';
    const { value } = event.target;
    const { entity } = this.state;
    const notEmpty = value.trim().length > 0;
    switch (type) {
      case 'email':
        state = notEmpty && verifyEmail(value) ? 'success' : 'error';
        break;
      case 'phone':
        state = notEmpty && verifyPhoneNumber(value) ? 'success' : 'error';
        break;
      case 'documentId':
        state = notEmpty ? '' : 'error';
        break;
      default:
    }
    entity[type] = value;
    this.setState({
      entity,
      [`${stateName}State`]: state,
    });
  }
  validateField = this.validateField.bind(this)
  handleSimple(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  handleSimple = this.handleSimple.bind(this)
  saveClick() {
    const { entity, entityId } = this.state;
    let promise;
    if (entityId) {
      entity.id = entityId;
      promise = employeeAPI.endpoints['personal-data'].update(entity);
    } else {
      promise = employeeAPI.endpoints['personal-data'].create(entity);
    }
    promise.then(response => response.json())
      .then((data) => {
        const { errors, errmsg } = data;
        if (errors || errmsg) {
          const err = errors ? errors : errmsg;
          logError(err);
          return;
        }
        this.props.updateEmployeeData(data, 'personalData');
      })
      .catch(error => logError(error));
  }
  saveClick = this.saveClick.bind(this);
  render() {
    const { classes } = this.props;
    const { entity } = this.state;
    const maritalStatusOptions = generateMenuItemList(maritalStatusConstant, classes);
    const countryListOptions = generateMenuItemList(countryListConstant, classes);
    const genderListOptions = generateMenuItemList(genderListConstant, classes);
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <form>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Documento de Identidad *
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      error={this.state.documentIdState === 'error'}
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        id: "documentId",
                        name: "documentId",
                        required: true,
                        value: entity.documentId,
                        onChange: event =>
                          this.validateField(event, 'documentId', 'documentId'),
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Nombre *
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
                        required: true,
                        value: entity.firstName,
                        onChange: event =>
                          this.validateField(event, '', 'firstName'),
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Apellido *
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
                        required: true,
                        value: entity.lastName,
                        onChange: event =>
                          this.validateField(event, '', 'lastName'),
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Fecha de Nacimiento *
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <FormControl fullWidth className={classes.formControlCustomInput}>
                      <Datetime
                        id="DOB"
                        timeFormat={false}
                        dateFormat={dateFormat}
                        viewDate={startingDOBDate}
                        inputProps={{
                          name: 'DOB',
                          id: 'DOB',
                          required: true,
                        }}
                        value={entity.DOB}
                        onBlur={momentObj =>
                            this.onDOBChange(momentObj, '', 'DOB')}
                        closeOnSelect
                      />
                    </FormControl>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Estado Civil
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
                        value={entity.maritalStatus || ''}
                        inputProps={{
                          name: 'maritalStatus',
                          id: 'maritalStatus',
                          onChange: (event) => {
                            // this.handleSimple(event);
                            this.validateField(event, '', 'maritalStatus');
                          },
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
                    </FormControl>
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
                        value: entity.address,
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
                      // success={this.state.registerPhoneState === 'success'}
                      // error={this.state.registerPhoneState === 'error'}
                      labelText="981-123-456"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      value={entity.phone}
                      inputProps={{
                        type: 'tel',
                        name: 'phone',
                        value: entity.phone,
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
                    <FormControl fullWidth className={classes.formControlCustomInput}>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu,
                        }}
                        classes={{
                          select: classes.select,
                        }}
                        value={entity.nationality || ''}
                        inputProps={{
                          name: 'nationality',
                          id: 'nationality',
                          onChange: (event) => {
                            this.validateField(event, '', 'nationality');
                          },
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
                    </FormControl>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      G&eacute;nero
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
                        value={entity.gender || ''}
                        inputProps={{
                          name: 'gender',
                          id: 'gender',
                          onChange: (event) => {
                            this.validateField(event, '', 'gender');
                          },
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
                    </FormControl>
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
                        value: entity.email,
                      }}
                    />
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

PersonalDataForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  updateEmployeeData: PropTypes.func.isRequired,
  employee: PropTypes.shape({}).isRequired,
};

export default withStyles(regularFormsStyle)(PersonalDataForm);
