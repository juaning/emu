import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
// import shortid from 'shortid';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

// @material-ui/icons
import Assignment from '@material-ui/icons/Assignment';
// import Dvr from '@material-ui/icons/Dvr';
// import Favorite from '@material-ui/icons/Favorite';
// import Close from '@material-ui/icons/Close';

// import 'react-table/react-table.css';

// core components
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import Card from '../../components/Card/Card';
import CardBody from '../../components/Card/CardBody';
import CardHeader from '../../components/Card/CardHeader';
import CardIcon from '../../components/Card/CardIcon';
import CustomInput from '../../components/CustomInput/CustomInput';

import regularFormsStyle from '../../assets/jss/material-dashboard-pro-react/views/regularFormsStyle';
// import { cardTitle } from '../../assets/jss/material-dashboard-pro-react';

import {
  logError,
  calculateOffDays,
} from '../../resources/helpers';
import {
  monthNamesConstant,
  employeesAttendanceListConstant,
} from '../../resources/constants';

// API resources
import API from '../../resources/api';

const employeeAPI = new API({ url: '/employee' });
employeeAPI.createEntity({ name: 'personal-data' });

class MonthlyAttendanceForm extends React.Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
  }
  state = {
    checkedA: false,
    checkedB: false,
    checkedC: false,
    attendanceEntity: {
      month: monthNamesConstant[(new Date()).getMonth()],
      employees: employeesAttendanceListConstant,
    },
  }
  componentDidMount() {
    // employeeAPI.endpoints['personal-data'].getAll()
    //   .then(results => results.json())
    //   .then(data => this.setState({ personalData: data }))
    //   .catch(err => logError(err));
  }
  createColumns() {
    const columns = [
      {
        Header: 'Empleado',
        columns: [
          {
            Header: 'Código',
            accessor: 'employeeId',
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
    return (
      <GridContainer key={employeeId}>
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
    if (value === '') value = event.target.checked;
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
  render() {
    const { classes } = this.props;
    const { attendanceEntity } = this.state;
    const { employees, month } = attendanceEntity;
    const styles = { 'text-align': 'left' };
    return (
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="primary" icon>
              <CardIcon color="primary">
                <Assignment />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>Asistencia Mensual {month}</h4>
            </CardHeader>
            <CardBody>
              <ReactTable
                data={employees}
                filterable
                columns={this.createColumns()}
                defaultPageSize={10}
                showPaginationTop={false}
                showPaginationBottom
                SubComponent={this.generateSubComponent}
                className="-striped -highlight"
                styles={styles}
                previousText="Anterior"
                nextText="Siguiente"
                pageText="Pagina"
                ofText="de"
                rowsText="filas"
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles(regularFormsStyle)(MonthlyAttendanceForm);
