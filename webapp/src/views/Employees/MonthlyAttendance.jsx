import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import Datetime from 'react-datetime';
import SweetAlert from "react-bootstrap-sweetalert";
import moment from 'moment';
import * as _ from 'lodash';
// import { DotLoader } from 'react-spinners';
import 'moment/locale/es';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';

// @material-ui/icons
import Assignment from '@material-ui/icons/Assignment';

// core components
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import Card from '../../components/Card/Card';
import CardBody from '../../components/Card/CardBody';
import CardHeader from '../../components/Card/CardHeader';
import CardIcon from '../../components/Card/CardIcon';
import CustomInput from '../../components/CustomInput/CustomInput';
import Button from '../../components/CustomButtons/Button';

import regularFormsStyle from '../../assets/jss/material-dashboard-pro-react/views/regularFormsStyle';

import {
  calculateOffDays,
  calculateExtraHours,
  logError,
} from '../../resources/helpers';
import {
  datesConstant,
  reactTableTextMsg,
  hoursByDay,
} from '../../resources/constants';

// API resources
import API from '../../resources/api';

moment.locale('es');

const employeeAPI = new API({ url: '/employee' });
employeeAPI.createEntity({ name: 'personal-data' });
employeeAPI.createEntity({ name: 'work' });
employeeAPI.createEntity({ name: 'attendance' });
employeeAPI.createEntity({ name: 'salary'});
const { monthYear } = datesConstant;

class MonthlyAttendanceForm extends React.Component {
  static generateEmployeeAttendanceObj() {
    return {
      employeeId: '',
      firstName: '',
      lastName: '',
      totalMonthDays: 30,
      totalWorkedDays: 30,
      totalWorkedSSDays: 30,
      discountDays: false,
      reportDiscountDays: false,
      extraHours: {
        total: 0,
        nightlyHours: 0,
        dailyExtraHours: 0,
        nightlyExtraHours: 0,
        sundayHolidaysHours: 0,
        sundayHolidaysExtraHours: 0,
      },
      absence: {
        excusedAbsence: {
          days: 0,
          discount: false,
          socialSecurityDiscount: false,
        },
        unjustifiedAbsence: {
          days: 0,
          discount: false,
          socialSecurityDiscount: false,
        },
        suspension: {
          days: 0,
          discount: false,
          socialSecurityDiscount: false,
        },
        permission: {
          days: 0,
          discount: false,
          socialSecurityDiscount: false,
        },
      },
      lateArrivalHours: 0,
      lateArrivalMinutes: 0,
      laborRegime: 'monthly',
      totalWorkedHours: 0,
      totalWorkedMinutes: 0,
    };
  }
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
  }
  state = {
    loading: true,
    wasSalaryGenerated: false,
    showAlert: true,
    attendanceEntity: {
      monthName: _.startCase(moment().format('MMMM')),
      month: moment().format('MM'),
      year: moment().format('YYYY'),
      employees: [],
    },
  }
  componentDidMount() {
    const month = moment().format('MM');
    const year = moment().format('YYYY');
    const promises = [];
    promises.push(employeeAPI.endpoints.attendance.getOne({
      id: `${month}-${year}`,
    }));
    promises.push(employeeAPI.endpoints.salary.getOne({
      id: `${month}-${year}`
    }));
    Promise.all(promises)
      .then(results => Promise.all(results.map(result => result.json())))
      .then(([attendanceData, salaryData]) => {
        const { attendanceEntity } = this.state;
        attendanceEntity.employees = attendanceData;
        this.setState({
          attendanceEntity,
          wasSalaryGenerated: salaryData.length > 0,
        });
      })
      .catch(err => logError(err));
  }
  onExpandedChange(newExpanded, index) {
    const { attendanceEntity } = this.state;
    const { employees } = attendanceEntity;
    const close = newExpanded[index[0]];
    if (close === false) {
      // Set empty string for absence days and extra hours to 0
      const employee = employees[index[0]];
      const {
        absence,
        extraHours,
        holidayDays,
        lateArrivalHours,
        lateArrivalMinutes,
      } = employee;
      const {
        excusedAbsence,
        permission,
        suspension,
        unjustifiedAbsence,
      } = absence;
      const changeEmptyStrToZero = item => (item === '' ? 0 : item);
      excusedAbsence.days = changeEmptyStrToZero(excusedAbsence.days);
      permission.days = changeEmptyStrToZero(permission.days);
      suspension.days = changeEmptyStrToZero(suspension.days);
      unjustifiedAbsence.days = changeEmptyStrToZero(unjustifiedAbsence.days);
      extraHours.dailyExtraHours = changeEmptyStrToZero(extraHours.dailyExtraHours);
      extraHours.nightlyExtraHours = changeEmptyStrToZero(extraHours.nightlyExtraHours);
      extraHours.nightlyHours = changeEmptyStrToZero(extraHours.nightlyHours);
      extraHours.sundayHolidaysExtraHours = changeEmptyStrToZero(extraHours
        .sundayHolidaysExtraHours);
      extraHours.sundayHolidaysHours = changeEmptyStrToZero(extraHours.sundayHolidaysHours);
      employee.holidayDays = changeEmptyStrToZero(holidayDays);
      employee.lateArrivalHours = changeEmptyStrToZero(lateArrivalHours);
      employee.lateArrivalMinutes = changeEmptyStrToZero(lateArrivalMinutes);
      this.setState({ attendanceEntity });
    }
  }
  createColumns() {
    const columns = [
      {
        Header: 'Empleado',
        columns: [
          {
            Header: 'Código',
            accessor: 'employeeDocumentId',
            maxWidth: 100,
          },
          {
            Header: 'Nombre',
            accessor: 'firstName',
          },
          {
            Header: 'Apellido',
            accessor: 'lastName',
          },
        ],
      },
      {
        Header: 'Días Trabajados',
        columns: [
          {
            Header: 'Total días trabajados',
            accessor: 'totalWorkedDays',
            maxWidth: 200,
          },
          {
            Header: 'Total días trabajados IPS',
            accessor: 'totalWorkedSSDays',
          },
          // {
          //   Header: 'Descontar',
          //   accessor: 'discountDays',
          // },
          {
            Header: 'Informar MJT/IPS',
            accessor: 'reportDiscountDays',
            maxWidth: 200,
            Cell: (row) => {
              const { classes } = this.props;
              const { employeeId, reportDiscountDays } = row.original;
              return (
                <FormControlLabel
                  control={
                    <Switch
                      checked={reportDiscountDays}
                      onChange={event =>
                        this.handleSwitchChange(event, 'reportDiscountDays', employeeId)}
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
                />
              );
            },
          },
        ],
      },
      {
        Header: 'Horas Extras',
        columns: [
          {
            Header: 'Horas extras',
            id: 'extraHours',
            accessor: employee => employee.extraHours.total,
          },
        ],
      },
    ];
    return columns;
  }
  createColumns = this.createColumns.bind(this)
  generateSubComponentAbsence(params) {
    const {
      obj,
      title,
      name,
      employeeId,
      isNotMonthly,
    } = params;
    const { classes } = this.props;
    if (!isNotMonthly) {
      return (
        <GridContainer key={name}>
          <GridItem xs={12} sm={12} md={12}>
            <GridContainer>
              <GridItem xs={12} sm={3}>
                <FormLabel className={classes.labelHorizontal}>
                  {title}
                </FormLabel>
              </GridItem>
              <GridItem xs={12} sm={1}>
                <CustomInput
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    name,
                    id: name,
                    value: obj.days,
                    onChange: event =>
                      this.storeAbsenceChangedField(event, name, employeeId, 'days'),
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={3}>
                <FormControl fullWidth className={classes.formControlCustomInput}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={obj.discount}
                        onChange={event =>
                          this.storeAbsenceChangedField(event, name, employeeId, 'discount')}
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
                    label="Descontar"
                  />
                </FormControl>
              </GridItem>
              <GridItem xs={12} sm={3}>
                <FormControl fullWidth className={classes.formControlCustomInput}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={obj.socialSecurityDiscount}
                        onChange={event =>
                          this.storeAbsenceChangedField(event, name, employeeId, 'socialSecurityDiscount')}
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
                    label="Descontar para IPS"
                  />
                </FormControl>
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      );
    } else {
      const { laborRegime } = obj;
      if (laborRegime === 'daily') {
        return (
          <GridContainer key={name}>
            <GridItem xs={12} sm={12} md={12}>
              <GridContainer>
                <GridItem xs={12} sm={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    {title}
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={1}>
                  <CustomInput
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name,
                      id: name,
                      value: obj.totalWorkedDays,
                      onChange: event =>
                        this.workedTimeChanged(event, name, employeeId),
                    }}
                  />
                </GridItem>
              </GridContainer>
            </GridItem>
          </GridContainer>
        );
      } else {
        return (
          <GridContainer key="workedTime">
            <GridItem xs={12} sm={12} md={12}>
              <GridContainer>
                <GridItem xs={12} sm={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Horas trabajadas
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={2}>
                  <CustomInput
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      id: 'totalWorkedHours',
                      value: obj.totalWorkedHours,
                      onChange: event =>
                        this.workedTimeChanged(event, 'totalWorkedHours', employeeId),
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Minutos trabajados
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={2}>
                  <CustomInput
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      id: 'totalWorkedMinutes',
                      value: obj.totalWorkedMinutes,
                      onChange: event =>
                        this.workedTimeChanged(event, 'totalWorkedMinutes', employeeId),
                    }}
                  />
                </GridItem>
              </GridContainer>
            </GridItem>
          </GridContainer>
        );
      }
    }
  }
  generateSubComponentHours(extraHours, employeeId) {
    const { classes } = this.props;
    const style = {
      minHeight: '92px',
    }
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <GridContainer style={style}>
            <GridItem xs={12} sm={9}>
              <FormLabel className={classes.labelHorizontal}>
                Horas nocturnas (50%)
              </FormLabel>
            </GridItem>
            <GridItem xs={12} sm={3}>
              <CustomInput
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  name: 'nightlyHours',
                  id: 'nightlyHours',
                  value: extraHours.nightlyHours,
                  onChange: event =>
                    this.storeExtraHoursChangedField(event, 'nightlyHours', employeeId),
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer style={style}>
            <GridItem xs={12} sm={9}>
              <FormLabel className={classes.labelHorizontal}>
                Horas extra diurna (50%)
              </FormLabel>
            </GridItem>
            <GridItem xs={12} sm={3}>
              <CustomInput
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  name: 'dailyExtraHours',
                  id: 'dailyExtraHours',
                  value: extraHours.dailyExtraHours,
                  onChange: event =>
                    this.storeExtraHoursChangedField(event, 'dailyExtraHours', employeeId),
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer style={style}>
            <GridItem xs={12} sm={9}>
              <FormLabel className={classes.labelHorizontal}>
                Horas extra nocturna (100%)
              </FormLabel>
            </GridItem>
            <GridItem xs={12} sm={3}>
              <CustomInput
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  name: 'nightlyExtraHours',
                  id: 'nightlyExtraHours',
                  value: extraHours.nightlyExtraHours,
                  onChange: event =>
                    this.storeExtraHoursChangedField(event, 'nightlyExtraHours', employeeId),
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer style={style}>
            <GridItem xs={12} sm={9}>
              <FormLabel className={classes.labelHorizontal}>
                Horas domingos y feriados (100%)
              </FormLabel>
            </GridItem>
            <GridItem xs={12} sm={3}>
              <CustomInput
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  name: 'sundayHolidaysHours',
                  id: 'sundayHolidaysHours',
                  value: extraHours.sundayHolidaysHours,
                  onChange: event =>
                    this.storeExtraHoursChangedField(event, 'sundayHolidaysHours', employeeId),
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer style={style}>
            <GridItem xs={12} sm={9}>
              <FormLabel className={classes.labelHorizontal}>
                Horas extra domingos y feriados (200%)
              </FormLabel>
            </GridItem>
            <GridItem xs={12} sm={3}>
              <CustomInput
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  name: 'sundayHolidaysExtraHours',
                  id: 'sundayHolidaysExtraHours',
                  value: extraHours.sundayHolidaysExtraHours,
                  onChange: event =>
                    this.storeExtraHoursChangedField(event, 'sundayHolidaysExtraHours', employeeId),
                }}
              />
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
    );
  }
  generateSubComponent(row) {
    const { attendanceEntity: { employees }} = this.state;
    const employee = employees[row.index];
    const {
      absence,
      extraHours,
      holidayDays,
      employeeId,
    } = row.original;
    const {
      excusedAbsence,
      unjustifiedAbsence,
      suspension,
      permission,
    } = absence;
    const absenceComponents = [];
    const { classes } = this.props;
    const {
      lateArrivalHours,
      lateArrivalMinutes,
      laborRegime,
      totalWorkedDays,
      hours,
      minutes,
    } = employee;
    if (laborRegime !== 'monthly') {
      let argsObj = {
          obj: {
          hours,
          minutes,
          laborRegime,
        },
        employeeId,
        isNotMonthly: true,
      };
      if (laborRegime === 'daily') {
        argsObj = {
          obj: {
            totalWorkedDays,
            laborRegime,
          },
          title: 'Días trabajados',
          name: 'totalWorkedDays',
          employeeId,
          isNotMonthly: true,
        };
      }
      absenceComponents.push(this.generateSubComponentAbsence(argsObj));
    }
    absenceComponents.push(this.generateSubComponentAbsence({
      obj: excusedAbsence,
      title: 'Días de ausencia justificada',
      name: 'excusedAbsence',
      employeeId,
    }));
    if (laborRegime === 'monthly') {
      absenceComponents.push(this.generateSubComponentAbsence({
        obj: unjustifiedAbsence,
        title: 'Días de ausencia injustificada',
        name: 'unjustifiedAbsence',
        employeeId,
      }));
    }
    absenceComponents.push(this.generateSubComponentAbsence({
      obj: suspension,
      title: 'Días de suspensión',
      name: 'suspension',
      employeeId,
    }));
    absenceComponents.push(this.generateSubComponentAbsence({
      obj: permission,
      title: 'Días de permiso',
      name: 'permission',
      employeeId,
    }));
    absenceComponents.push(
      <GridContainer key="variousFields">
        <GridItem xs={12} sm={12} md={12}>
          <GridContainer>
            <GridItem xs={12} sm={3}>
              <FormLabel className={classes.labelHorizontal}>
                Días de Vacaciones
              </FormLabel>
            </GridItem>
            <GridItem xs={12} sm={1}>
              <CustomInput
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  name: 'holidayDays',
                  id: 'holidayDays',
                  value: holidayDays,
                  onChange: event =>
                    this.storeHolidayDaysChangedField(event, employeeId),
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={3}>
              <FormLabel className={classes.labelHorizontal}>
                Llegadas Tardias (horas):
              </FormLabel>
            </GridItem>
            <GridItem xs={12} sm={1}>
              <CustomInput
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  name: 'lateArrivalHours',
                  id: 'lateArrivalHours',
                  value: lateArrivalHours,
                  onChange: event =>
                    this.lateArrivalsChanged(event, row, 'lateArrivalHours'),
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={3}>
              <FormLabel className={classes.labelHorizontal}>
                Llegadas Tardias (minutos):
              </FormLabel>
            </GridItem>
            <GridItem xs={12} sm={1}>
              <CustomInput
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  name: 'lateArrivalMinutes',
                  id: 'lateArrivalMinutes',
                  value: lateArrivalMinutes,
                  onChange: event =>
                    this.lateArrivalsChanged(event, row, 'lateArrivalMinutes'),
                }}
              />
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
    );
    return (
      <GridContainer >
        <GridItem xs={12} sm={5} md={3}>
          {this.generateSubComponentHours(extraHours, employeeId)}
        </GridItem>
        <GridItem xs={12} sm={7} md={9}>
          {absenceComponents}
        </GridItem>
      </GridContainer>
    );
  }
  generateSubComponent = this.generateSubComponent.bind(this)
  handleChange = name => (event) => {
    this.setState({ [name]: event.target.checked });
  };
  storeHolidayDaysChangedField = (event, employeeId) => {
    let { value } = event.target;
    const { attendanceEntity } = this.state;
    const { employees } = attendanceEntity;
    const employee = employees.find(emp => emp.employeeId === employeeId);
    const { absence, totalMonthDays } = employee;
    employee.holidayDays = value * 1;
    employee.totalWorkedDays = totalMonthDays - (calculateOffDays(
      absence, 'discount') + (value * 1));
    employee.totalWorkedSSDays = totalMonthDays - (calculateOffDays(
      absence, 'socialSecurityDiscount') + (value * 1));
    const employeeIndex = employees.findIndex(x => x.employeeId === employeeId);
    employees[employeeIndex] = employee;
    attendanceEntity.employees = employees;
    this.setState({ attendanceEntity });
  }
  storeAbsenceChangedField(event, objName, employeeId, field) {
    let { value } = event.target;
    const isCheckbox = field === 'discount' || field === 'socialSecurityDiscount';
    if (isCheckbox) value = event.target.checked;
    const { attendanceEntity } = this.state;
    const { employees } = attendanceEntity;
    const employee = employees.find(emp => emp.employeeId === employeeId);
    const { absence, totalMonthDays, holidayDays } = employee;
    absence[objName][field] = value;
    employee.totalWorkedDays = totalMonthDays - calculateOffDays(
      absence, 'discount') - holidayDays;
    employee.totalWorkedSSDays = totalMonthDays - calculateOffDays(
      absence, 'socialSecurityDiscount') - holidayDays;
    employee.absence = absence;
    const employeeIndex = employees.findIndex(x => x.employeeId === employeeId);
    employees[employeeIndex] = employee;
    attendanceEntity.employees = employees;
    this.setState({ attendanceEntity });
  }
  storeExtraHoursChangedField(event, field, employeeId) {
    const { value } = event.target;
    const { attendanceEntity } = this.state;
    const { employees } = attendanceEntity;
    const employee = employees.find(emp => emp.employeeId === employeeId);
    const { extraHours } = employee;
    extraHours[field] = value;
    extraHours.total = calculateExtraHours(extraHours);
    employee.extraHours = extraHours;
    const employeeIndex = employees.findIndex(x => x.employeeId === employeeId);
    employees[employeeIndex] = employee;
    attendanceEntity.employees = employees;
    this.setState({ attendanceEntity });
  }
  storeExtraHoursChangedField = this.storeExtraHoursChangedField.bind(this);
  handleSwitchChange(event, field, employeeId) {
    const { checked } = event.target;
    const { attendanceEntity } = this.state;
    const { employees } = attendanceEntity;
    const employee = employees.find(emp => emp.employeeId === employeeId);
    const employeeIndex = employees.findIndex(x => x.employeeId === employeeId);
    employee[field] = checked;
    employees[employeeIndex] = employee;
    attendanceEntity.employees = employees;
    this.setState({ attendanceEntity });
  }
  handleSwitchChange = this.handleSwitchChange.bind(this);
  lateArrivalsChanged = (event, row, name) => {
    const { index } = row;
    const { value } = event.target;
    const { attendanceEntity } = this.state;
    const { employees } = attendanceEntity;
    const employee = employees[index];
    employee[name] = value !== '' ? parseFloat(value) : 0;
    employees[index] = employee;
    attendanceEntity.employees = employees;
    this.setState ({ attendanceEntity });
  }
  workedTimeChanged = (event, field, employeeId) => {
    const { value } = event.target;
    const { attendanceEntity } = this.state;
    const { employees } = attendanceEntity;
    const employee = employees.find(emp => emp.employeeId === employeeId);
    employee[field] = value;
    if (field !== 'totalWorkedDays') {
      employee.totalWorkedDays = this.calculateWorkedDaysByTime(
        employee.totalWorkedHours, employee.totalWorkedMinutes);
    }
    this.setState({ attendanceEntity });
  }
  calculateWorkedDaysByTime = (hours, minutes) => {
    // Minutes / 60 minutes in an hour / 8 hours in a day
    // to get proper decimals
    let days = (hours / hoursByDay) + ((minutes / 60) / 8);
    return days;
  }
  attendanceDateChange(momentObj) {
    const { attendanceEntity } = this.state;
    let { monthName, month, year } = attendanceEntity;
    monthName = _.startCase(momentObj.format('MMMM'));
    month = momentObj.format('MM');
    year = momentObj.format('YYYY');
    const newAttendanceEntity = Object.assign({}, attendanceEntity, {
      monthName,
      month,
      year,
      employees: [],
    });
    const promises = [];
    promises.push(employeeAPI.endpoints.attendance.getOne({
      id: `${month}-${year}`,
    }));
    promises.push(employeeAPI.endpoints.salary.getOne({
      id: `${month}-${year}`
    }));
    Promise.all(promises)
      .then(results => Promise.all(results.map(result => result.json())))
      .then(([attendanceData, salaryData]) => {
        newAttendanceEntity.employees = attendanceData;
        this.setState({
          attendanceEntity: newAttendanceEntity,
          wasSalaryGenerated: salaryData.length > 0,
        });
      })
      .catch(err => logError(err));
  }
  saveClick() {
    const { attendanceEntity, wasSalaryGenerated, showAlert } = this.state;
    if (wasSalaryGenerated && showAlert) {
      // Show Alert
      this.setState({
        alert: (
          <SweetAlert
            warning
            showCancel
            style={{ display: "block", marginTop: "-100px" }}
            title="Atención"
            onConfirm={this.saveAndHideAlert}
            onCancel={this.hideAlert}
            cancelBtnBsStyle="default"
            confirmBtnBsStyle="danger"
            confirmBtnCssClass={
              `${this.props.classes.button} ${this.props.classes.warning}`
            }
            confirmBtnText="Guardar"
            cancelBtnText="Cancelar"
          >
            <p>La planilla de salarios ya fue generada. Cualquier cambio creará
              inconsistencias con la planilla de salarios. Si decide continuar
              debe generar una nueva planilla de salarios.</p>
          </SweetAlert>
        ),
      });
      return;
    }
    let { month, year, employees } = attendanceEntity;
    if (employees.length > 0) {
      const employee = employees[0];
      const params = {
        url: `${month}-${year}`,
        body: attendanceEntity,
      };
      let promise;
      if (employee.createdAt !== undefined) {
        promise = employeeAPI.endpoints.attendance.updateWithUrl(params);
      } else {
        promise = employeeAPI.endpoints.attendance.createWithUrl(params);
      }
      promise.then(results => results.json())
        .then(data => {
          attendanceEntity.employees = data;
          this.setState({ attendanceEntity });
        })
        .catch(err => logError(err));
    } else {} // Generate popup with can't save empty
  }
  saveClick = this.saveClick.bind(this)
  importClick() {
    const { attendanceEntity } = this.state;
    console.log('import', attendanceEntity);
  }
  importClick = this.importClick.bind(this);
  hideAlert = () => {
    this.setState({
      alert: null,
      showAlert: false,
    })
  }
  saveAndHideAlert = () => {
    this.hideAlert();
    this.saveClick();
  }
  generateClick() {
    const { attendanceEntity } = this.state;
    const promises = [];
    
    promises.push(employeeAPI.endpoints['personal-data'].getAll());
    promises.push(employeeAPI.endpoints.work.getAll());

    Promise.all(promises)
      .then(results => Promise.all(results.map(result => result.json())))
      .then(([personalData, workData]) => {
        const newEmployees = personalData.map((person) => {
          const yesterday = ( d => new Date(d.setDate(d.getDate()-1)) )(new Date());
          const employee = MonthlyAttendanceForm.generateEmployeeAttendanceObj();
          employee.employeeId = person._id;
          employee.employeeDocumentId = person.documentId;
          employee.firstName = person.firstName;
          employee.lastName = person.lastName;
          // Find current contract to get labor regime
          const work = workData
            .find(employeeWork => employeeWork.employeeId === person._id
              && (employeeWork.endDateContract > yesterday.toJSON()
              || employeeWork.endDateContract === undefined
              || employeeWork.endDateContract === null));
          employee.laborRegime = work.laborRegime;
          return employee;
        });
        attendanceEntity.employees = newEmployees;
        this.setState({ attendanceEntity });
        return newEmployees;
      })
      .catch(err => logError(err));
  }
  generateClick = this.generateClick.bind(this)
  render() {
    const { classes } = this.props;
    const { attendanceEntity } = this.state;
    const { employees, monthName, year } = attendanceEntity;
    const styles = { 'text-align': 'left' };
    const monthYearValue = `${monthName} ${year}`;
    return (
      <GridContainer>
        <GridItem xs={12}>
          {this.state.alert}
          <Card>
            <CardHeader color="primary" icon>
              <CardIcon color="primary">
                <Assignment />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>Asistencia Mensual {monthName}</h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>
                    Seleccione fecha de asistencia
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={6}>
                  <FormControl fullWidth className={classes.formControlCustomInput}>
                    <Datetime
                      id="monthYear"
                      timeFormat={false}
                      dateFormat={monthYear}
                      value={monthYearValue}
                      inputProps={{
                        name: 'monthYear',
                        id: 'monthYear',
                      }}
                      onChange={momentObj =>
                          this.attendanceDateChange(momentObj)}
                      closeOnSelect
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={4} style={{ textAlign: 'right' }}>
                  <Button
                    color="rose"
                    onClick={this.saveClick}
                    className={classes.registerButton}
                  >
                    Guardar
                  </Button>
                  <Button
                    color="primary"
                    onClick={this.importClick}
                    className={classes.registerButton}
                  >
                    Importar
                  </Button>
                  <Button
                    color="info"
                    onClick={this.generateClick}
                    className={classes.registerButton}
                  >
                    Generar
                  </Button>
                </GridItem>
              </GridContainer>
              <ReactTable
                data={employees}
                filterable
                defaultFilterMethod={
                  (filter, row) => String(row[filter.id]).toLowerCase()
                    .includes(filter.value.toLowerCase())
                }
                columns={this.createColumns()}
                defaultPageSize={10}
                showPaginationTop={false}
                showPaginationBottom
                SubComponent={this.generateSubComponent}
                onExpandedChange={(newExpanded, index) =>
                  this.onExpandedChange(newExpanded, index)}
                className="-striped -highlight"
                styles={styles}
                previousText={reactTableTextMsg.previousText}
                nextText={reactTableTextMsg.nextText}
                pageText={reactTableTextMsg.pageText}
                ofText={reactTableTextMsg.ofText}
                rowsText={reactTableTextMsg.rowsText}
                noDataText={reactTableTextMsg.noDataTextAssistance}
                loadingText={reactTableTextMsg.loadingText}
                collapseOnDataChange={false}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles(regularFormsStyle)(MonthlyAttendanceForm);
