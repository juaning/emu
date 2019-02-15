import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import Datetime from 'react-datetime';
import moment from 'moment';
import * as _ from 'lodash';
// import { DotLoader } from 'react-spinners';
import 'moment/locale/es';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

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
import { datesConstant, reactTableTextMsg } from '../../resources/constants';

// API resources
import API from '../../resources/api';

moment.locale('es');

const employeeAPI = new API({ url: '/employee' });
employeeAPI.createEntity({ name: 'personal-data' });
employeeAPI.createEntity({ name: 'attendance' });
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
    };
  }
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
  }
  state = {
    loading: true,
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
    employeeAPI.endpoints.attendance.getOne({ id: `${month}-${year}` })
      .then(results => results.json())
      .then((data) => {
        const { attendanceEntity } = this.state;
        attendanceEntity.employees = data;
        this.setState({ attendanceEntity });
      })
      .catch(err => logError(err));
  }
  onExpandedChange(newExpanded, index) {
    const { attendanceEntity } = this.state;
    const { employees } = attendanceEntity;
    const close = newExpanded[index[0]];
    if (close === false) {
      // Set empty string for absence days and extra hours to 0
      const { absence, extraHours } = employees[index[0]];
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
    } = params;
    const { classes } = this.props;
    const containerKey = `absence-${employeeId}`;
    return (
      <GridContainer key={containerKey}>
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
            </GridItem>
            <GridItem xs={12} sm={3}>
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
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
    );
  }
  generateSubComponentHours(extraHours, employeeId) {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <GridContainer>
            <GridItem xs={12} sm={10}>
              <FormLabel className={classes.labelHorizontal}>
                Horas nocturnas (50%)
              </FormLabel>
            </GridItem>
            <GridItem xs={12} sm={2}>
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
          <GridContainer>
            <GridItem xs={12} sm={10}>
              <FormLabel className={classes.labelHorizontal}>
                Horas extra diurna (50%)
              </FormLabel>
            </GridItem>
            <GridItem xs={12} sm={2}>
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
          <GridContainer>
            <GridItem xs={12} sm={10}>
              <FormLabel className={classes.labelHorizontal}>
                Horas extra nocturna (100%)
              </FormLabel>
            </GridItem>
            <GridItem xs={12} sm={2}>
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
          <GridContainer>
            <GridItem xs={12} sm={10}>
              <FormLabel className={classes.labelHorizontal}>
                Horas domingos y feriados (100%)
              </FormLabel>
            </GridItem>
            <GridItem xs={12} sm={2}>
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
          <GridContainer>
            <GridItem xs={12} sm={10}>
              <FormLabel className={classes.labelHorizontal}>
                Horas extra domingos y feriados (200%)
              </FormLabel>
            </GridItem>
            <GridItem xs={12} sm={2}>
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
    const { absence, extraHours, employeeId } = row.original;
    const {
      excusedAbsence,
      unjustifiedAbsence,
      suspension,
      permission,
    } = absence;
    const absenceComponents = [];
    absenceComponents.push(this.generateSubComponentAbsence({
      obj: excusedAbsence,
      title: 'Días de ausencia justificada',
      name: 'excusedAbsence',
      employeeId,
    }));
    absenceComponents.push(this.generateSubComponentAbsence({
      obj: unjustifiedAbsence,
      title: 'Días de ausencia injustificada',
      name: 'unjustifiedAbsence',
      employeeId,
    }));
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
    return (
      <GridContainer>
        <GridItem xs={12} sm={4} md={3}>
          {this.generateSubComponentHours(extraHours, employeeId)}
        </GridItem>
        <GridItem xs={12} sm={8} md={9}>
          {absenceComponents}
        </GridItem>
      </GridContainer>
    );
  }
  generateSubComponent = this.generateSubComponent.bind(this)
  handleChange = name => (event) => {
    this.setState({ [name]: event.target.checked });
  };
  storeAbsenceChangedField(event, objName, employeeId, field) {
    let { value } = event.target;
    if (field === 'discount') value = event.target.checked;
    const { attendanceEntity } = this.state;
    const { employees } = attendanceEntity;
    const employee = employees.find(emp => emp.employeeId === employeeId);
    const {
      absence,
      totalMonthDays,
    } = employee;
    absence[objName][field] = value;
    employee.totalWorkedDays = totalMonthDays - calculateOffDays(absence, 'discount');
    employee.totalWorkedSSDays = totalMonthDays - calculateOffDays(absence, 'socialSecurityDiscount');
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
    employeeAPI.endpoints.attendance.getOne({ id: `${month}-${year}` })
      .then(results => results.json())
      .then((data) => {
        newAttendanceEntity.employees = data;
        this.setState({ attendanceEntity: newAttendanceEntity });
      })
      .catch(err => logError(err));
  }
  saveClick() {
    const { attendanceEntity } = this.state;
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
  generateClick() {
    const { attendanceEntity } = this.state;
    employeeAPI.endpoints['personal-data'].getAll()
      .then(results => results.json())
      .then((data) => {
        const newEmployees = data.map((person) => {
          const employee = MonthlyAttendanceForm.generateEmployeeAttendanceObj();
          employee.employeeId = person._id;
          employee.employeeDocumentId = person.documentId;
          employee.firstName = person.firstName;
          employee.lastName = person.lastName;
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
