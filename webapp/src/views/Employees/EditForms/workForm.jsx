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
  contractTypeConstant,
  jobTitleConstant,
  costCentreConstant,
  shiftConstant,
} from '../../../resources/constants';
import {
  generateMenuItemList, logError,
} from '../../../resources/helpers';

const { dateFormat, dateFormatDB, timeFormat } = datesConstant;

const employeeAPI = new API({ url: '/employee' });
employeeAPI.createEntity({ name: 'work' });

class WorkForm extends React.Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
  }
  state = {
    workEntity: {
      employeeId: this.props.employee._id,
      contractType: '',
    },
  }
  onDateChange(momentObj, type) {
    const event = {
      target: {
        value: momentObj.format(dateFormatDB),
      },
    };
    this.fieldChange(event, type);
  }
  onDateChange = this.onDateChange.bind(this)
  onTimeChange(momentObj, type) {
    const event = {
      target: {
        value: momentObj.format(timeFormat),
      },
    };
    this.fieldChange(event, type);
  }
  fieldChange(event, type) {
    const { value } = event.target;
    const { workEntity } = this.state;
    workEntity[type] = value;
    this.setState({ workEntity });
  }
  saveClick() {
    const { workEntity } = this.state;
    employeeAPI.endpoints.work.create(workEntity)
      .then(response => response.json())
      .then(data => {
        const { errors } = data;
        if (errors) logError(errors);
      })
      .catch(err => logError(err));
  }
  saveClick = this.saveClick.bind(this)
  render() {
    const { classes } = this.props;
    const { workEntity } = this.state;
    const contractTypeOptions = generateMenuItemList(contractTypeConstant, classes);
    const jobTitleOptions = generateMenuItemList(jobTitleConstant, classes);
    const costCentreOptions = generateMenuItemList(costCentreConstant, classes);
    const shiftOptions = generateMenuItemList(shiftConstant, classes);
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <form>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Fecha de Inicio
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <FormControl fullWidth className={classes.formControlCustomInput}>
                      <Datetime
                        id="startDate"
                        timeFormat={false}
                        dateFormat={dateFormat}
                        value={workEntity.startDate}
                        inputProps={{
                          name: 'startDate',
                          id: 'startDate',
                        }}
                        onChange={momentObj =>
                            this.onDateChange(momentObj, 'startDate')}
                        closeOnSelect
                      />
                    </FormControl>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Fecha de Inicio de Contrato
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={4}>
                    <FormControl fullWidth className={classes.formControlCustomInput}>
                      <Datetime
                        id="startDateContract"
                        timeFormat={false}
                        dateFormat={dateFormat}
                        value={workEntity.startDateContract}
                        inputProps={{
                          name: 'startDateContract',
                          id: 'startDateContract',
                        }}
                        onChange={momentObj =>
                            this.onDateChange(momentObj, 'startDateContract')}
                        closeOnSelect
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Fecha de Fin de Contrato
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={4}>
                    <FormControl fullWidth className={classes.formControlCustomInput}>
                      <Datetime
                        id="endDateContract"
                        timeFormat={false}
                        dateFormat={dateFormat}
                        value={workEntity.endDateContract}
                        inputProps={{
                          name: 'endDateContract',
                          id: 'endDateContract',
                        }}
                        onChange={momentObj =>
                            this.onDateChange(momentObj, 'endDateContract')}
                        closeOnSelect
                      />
                    </FormControl>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Tipo de Contrato
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
                        value={workEntity.contractType}
                        inputProps={{
                          name: 'contractType',
                          id: 'contractType',
                          onChange: event => this.fieldChange(event, 'contractType'),
                        }}
                        autoWidth
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem,
                          }}
                        >
                          Tipo de Contrato
                        </MenuItem>
                        {contractTypeOptions}
                      </Select>
                    </FormControl>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Cargo
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={4}>
                    <FormControl fullWidth className={classes.formControlCustomInput}>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu,
                        }}
                        classes={{
                          select: classes.select,
                        }}
                        value={workEntity.jobTitle}
                        inputProps={{
                          name: 'jobTitle',
                          id: 'jobTitle',
                          onChange: event => this.fieldChange(event, 'jobTitle'),
                        }}
                        autoWidth
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem,
                          }}
                        >
                          Cargo
                        </MenuItem>
                        {jobTitleOptions}
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Centro de Costo
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={4}>
                    <FormControl fullWidth className={classes.formControlCustomInput}>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu,
                        }}
                        classes={{
                          select: classes.select,
                        }}
                        value={workEntity.costCentre}
                        inputProps={{
                          name: 'costCentre',
                          id: 'costCentre',
                          onChange: event => this.fieldChange(event, 'costCentre'),
                        }}
                        autoWidth
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem,
                          }}
                        >
                          Centro de Costo
                        </MenuItem>
                        {costCentreOptions}
                      </Select>
                    </FormControl>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Horario de Entrada
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={2}>
                    <FormControl fullWidth className={classes.formControlCustomInput}>
                      <Datetime
                        id="startTime"
                        timeFormat
                        dateFormat={false}
                        // value={workEntity.startTime}
                        viewMode="time"
                        inputProps={{
                          name: 'startTime',
                          id: 'startTime',
                        }}
                        onChange={momentObj =>
                            this.onTimeChange(momentObj, 'startTime')}
                        closeOnSelect
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Horario de Salida
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={2}>
                    <FormControl fullWidth className={classes.formControlCustomInput}>
                      <Datetime
                        id="endTime"
                        timeFormat
                        dateFormat={false}
                        // value={workEntity.endTime}
                        viewMode="time"
                        inputProps={{
                          name: 'endTime',
                          id: 'endTime',
                        }}
                        onChange={momentObj =>
                            this.onTimeChange(momentObj, 'endTime')}
                        closeOnSelect
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Turno
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={2}>
                    <FormControl fullWidth className={classes.formControlCustomInput}>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu,
                        }}
                        classes={{
                          select: classes.select,
                        }}
                        value={workEntity.shift}
                        inputProps={{
                          name: 'shift',
                          id: 'shift',
                          onChange: event => this.fieldChange(event, 'shift'),
                        }}
                        autoWidth
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem,
                          }}
                        >
                          Turno
                        </MenuItem>
                        {shiftOptions}
                      </Select>
                    </FormControl>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Salario Diario
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={4}>
                    <CustomInput
                      id="dailySalary"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: event =>
                          this.fieldChange(event, 'dailySalary'),
                        id: 'dailySalary',
                        name: 'dailySalary',
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Salario Mensual
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={4}>
                    <CustomInput
                      id="monthlySalary"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: event =>
                          this.fieldChange(event, 'monthlySalary'),
                        id: 'monthlySalary',
                        name: 'monthlySalary',
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

export default withStyles(regularFormsStyle)(WorkForm);
