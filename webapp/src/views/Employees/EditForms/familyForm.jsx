import React from 'react';
import PropTypes from 'prop-types';
// react component plugin for creating a beautiful datetime dropdown picker
import Datetime from 'react-datetime';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

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
    familyEntity: {},
  }
  onDOBChange(date, name) {
    const { familyEntity } = this.state;
    const { childs = {} } = familyEntity;
    childs[name] = date.format(dateFormatDB);
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
  generateChildsDOB() {
    const { classes } = this.props;
    const { familyEntity } = this.state;
    const { childNumber = 0, childs = {} } = familyEntity;
    const dates = [];
    if (childNumber > 0) {
      for (let i = 0; i < childNumber; i += 1) {
        const childID = `childDOB-${i}`;
        dates.push(<GridContainer>
          <GridItem xs={12} sm={2} key={childID}>
            <FormLabel className={classes.labelHorizontal}>
              Fecha de Nacimiento hijo #{i + 1}
            </FormLabel>
          </GridItem>
          <GridItem xs={12} sm={10}>
            {/* TODO: add classes to match padding */}
            <Datetime
              id={childID}
              timeFormat={false}
              dateFormat={dateFormat}
              viewDate={startingDOBDate}
              value={childs[i]}
              inputProps={{
                name: childID,
                id: childID,
              }}
              onChange={momentObj => this.onDOBChange(momentObj, childID)}
              closeOnSelect
            />
          </GridItem>
        </GridContainer>); // eslint-disable-line
      }
    }
    return dates;
  }
  generateChildsDOB = this.generateChildsDOB.bind(this)
  saveClick() {
    const { familyEntity } = this.state;
    familyEntity.employeeId = this.props.employee.id;
    console.log(familyEntity);
    employeeAPI.endpoints.family
      .create(familyEntity)
      .then(response => response.json())
      .then((savedFamilyEntity) => {
        const { errors } = savedFamilyEntity;
        if (errors) {
          logError(errors);
        }
      })
      .catch(error => logError(error));
  }
  saveClick = this.saveClick.bind(this)
  render() {
    const { classes } = this.props;
    const numbersList = generateMenuWithNumbers(10);
    const childNumberOptions = generateMenuItemList(numbersList, classes);
    const childDOBList = this.generateChildsDOB();
    const { childNumber } = this.state.familyEntity;
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
  employee: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};

export default withStyles(regularFormsStyle)(FamilyForm);
