import React from 'react';
import PropTypes from 'prop-types';
// react component plugin for creating a beautiful datetime dropdown picker
import Datetime from 'react-datetime';
import moment from 'moment';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

// core components
import GridContainer from '../../../components/Grid/GridContainer';
import GridItem from '../../../components/Grid/GridItem';
import Button from '../../../components/CustomButtons/Button';
import CustomInput from '../../../components/CustomInput/CustomInput';
import Card from '../../../components/Card/Card';
import CardBody from '../../../components/Card/CardBody';

import regularFormsStyle from '../../../assets/jss/material-dashboard-pro-react/views/regularFormsStyle';

import {
  logError,
  generateMenuItemList,
  generateMenuWithNumbers,
} from '../../../resources/helpers';

import { datesConstant } from '../../../resources/constants';

// API resources
import API from '../../../resources/api';

const employeeAPI = new API({ url: '/employee' });
employeeAPI.createEntity({ name: 'family' });

const { startingDOBDate, dateFormat, dateFormatDB } = datesConstant;

class FamilyForm extends React.Component {
  state = {
    familyEntity: {
      employeeId: this.props.employeeId || '',
      childNumber: this.props.employee.childNumber || '',
      childs: this.props.employee.childs || [],
      firstNamePartner: this.props.employee.firstNamePartner || '',
      lastNamePartner: this.props.employee.lastNamePartner || '',
      workplacePartner: this.props.employee.workplacePartner || '',
      id: this.props.employee._id || null,
    },
  }
  onDOBChange(date, name, childID) {
    if (typeof date === 'string') return;
    const { familyEntity } = this.state;
    const { childs = [] } = familyEntity;
    if (!childs[childID]) childs[childID] = {
      dob: '',
      apply: false,
      bonusStartDate: ''
    };
    childs[childID][name] = date.format(dateFormatDB);
    familyEntity.childs = childs;
    this.setState({ familyEntity });
  }
  onDOBChange = this.onDOBChange.bind(this)
  storeChangedField(event, name) {
    const { value } = event.target;
    const { familyEntity } = this.state;
    familyEntity[name] = value;
    this.setState({ familyEntity });
  }
  storeChangedField = this.storeChangedField.bind(this)
  applyBono = (event, name, childID) => {
    const { familyEntity } = this.state;
    const { childs = [] } = familyEntity;
    if (!childs[childID]) childs[childID] = {
      dob: '',
      apply: false,
      bonusStartDate: ''
    };
    childs[childID].apply = event.target.checked;
    familyEntity.childs = childs;
    this.setState({ familyEntity });
  }
  generateChildsDOB() {
    const { classes } = this.props;
    const { familyEntity } = this.state;
    const { childNumber = 0, childs = [] } = familyEntity;
    const dates = [];
    if (childNumber > 0) {
      for (let i = 0; i < childNumber; i += 1) {
        const childID = `childDOB-${i}`;
        if (!childs[i]) {
          childs[i] = { dob: '', apply: false, bonusStartDate: '' };
        }
        const DOB = childs[i].dob &&
          moment(childs[i].dob).utc().format(dateFormat);
        const bonusDate = childs[i].bonusStartDate &&
          moment(childs[i].bonusStartDate).utc().format(dateFormat);
        dates.push(
        <GridContainer key={childID}>
          <GridItem xs={12} sm={2}>
            <FormLabel className={classes.labelHorizontal}>
              Fecha de Nacimiento hijo #{i + 1}
            </FormLabel>
          </GridItem>
          <GridItem xs={12} sm={2}>
            <FormControl fullWidth className={classes.formControlCustomInput}>
              <Datetime
                id={childID}
                timeFormat={false}
                dateFormat={dateFormat}
                viewDate={startingDOBDate}
                value={DOB}
                inputProps={{
                  name: childID,
                  id: childID,
                }}
                onChange={momentObj => this.onDOBChange(momentObj, 'dob', i)}
                closeOnSelect
              />
            </FormControl>
          </GridItem>
          <GridItem xs={12} sm={2}>
            <FormControl fullWidth className={classes.formControlCustomInput}>
              <FormControlLabel
                control={
                  <Switch
                    checked={childs[i].apply}
                    onChange={event =>
                      this.applyBono(event, 'bono', i)}
                    classes={{
                      switchBase: classes.switchBase,
                      checked: classes.switchChecked,
                      icon: classes.switchIcon,
                      iconChecked: classes.switchIconChecked,
                      bar: classes.switchBar,
                    }}
                  />
                }
                classes={{
                  label: classes.label,
                }}
                label="Aplica bonificación?"
              />
            </FormControl>
          </GridItem>
          <GridItem xs={12} sm={2}>
            <FormLabel className={classes.labelHorizontal}>
              Fecha de inicio bonificación
            </FormLabel>
          </GridItem>
          <GridItem xs={12} sm={4}>
            <FormControl fullWidth className={classes.formControlCustomInput}>
              <Datetime
                id={`${childID}-bonusStartDate`}
                timeFormat={false}
                dateFormat={dateFormat}
                value={bonusDate}
                inputProps={{
                  name: `${childID}-bonusStartDate`,
                  id: `${childID}-bonusStartDate`,
                }}
                onChange={momentObj => this.onDOBChange(momentObj, 'bonusStartDate', i)}
                closeOnSelect
              />
            </FormControl>
          </GridItem>
        </GridContainer>); // eslint-disable-line
      }
    }
    return dates;
  }
  generateChildsDOB = this.generateChildsDOB.bind(this)
  saveClick() {
    const { familyEntity } = this.state;
    let promise;
    if (familyEntity.id) {
      promise = employeeAPI.endpoints.family.update(familyEntity);
    } else {
      promise = employeeAPI.endpoints.family.create(familyEntity)
    }
    promise
      .then(response => response.json())
      .then((savedFamilyEntity) => {
        const { errors, errmsg } = savedFamilyEntity;
        if (errors || errmsg) {
          const err = errors ? errors : errmsg;
          logError(err);
          return;
        }
        this.props.updateEmployeeData(savedFamilyEntity, 'family');
      })
      .catch(error => logError(error));
  }
  saveClick = this.saveClick.bind(this)
  render() {
    const { classes } = this.props;
    const { familyEntity } = this.state;
    const numbersList = generateMenuWithNumbers(10);
    const childNumberOptions = generateMenuItemList(numbersList, classes);
    const childDOBList = this.generateChildsDOB();
    const { childNumber } = familyEntity;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <form>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Cantidad de hijos
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
                        value={childNumber}
                        inputProps={{
                          name: 'childNumber',
                          id: 'childNumber',
                          onChange: event => this.storeChangedField(event, 'childNumber'),
                        }}
                        autoWidth
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem,
                          }}
                        >
                          Cantidad de hijos
                        </MenuItem>
                        {childNumberOptions}
                      </Select>
                    </FormControl>
                  </GridItem>
                </GridContainer>
                {childDOBList}
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Nombre conyuge
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="firstNamePartner"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        name: 'firstNamePartner',
                        id: 'firstNamePartner',
                        onChange: event =>
                          this.storeChangedField(event, 'firstNamePartner'),
                        value: familyEntity.firstNamePartner,
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Apellido conyuge
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="lastNamePartner"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        name: 'lastNamePartner',
                        id: 'lastNamePartner',
                        onChange: event =>
                          this.storeChangedField(event, 'lastNamePartner'),
                        value: familyEntity.lastNamePartner,
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Lugar de trabajo conyuge
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="workplacePartner"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        name: 'workplacePartner',
                        id: 'workplacePartner',
                        value: familyEntity.workplacePartner,
                        onChange: event =>
                          this.storeChangedField(event, 'workplacePartner'),
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

FamilyForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  updateEmployeeData: PropTypes.func.isRequired,
  employee: PropTypes.shape({}).isRequired,
};

export default withStyles(regularFormsStyle)(FamilyForm);
