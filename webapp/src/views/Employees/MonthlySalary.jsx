import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import Datetime from 'react-datetime';
import moment from 'moment';
import * as _ from 'lodash';
import 'moment/locale/es';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';

// @material-ui/icons
import AttachMoney from '@material-ui/icons/AttachMoney';

// core components
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import Card from '../../components/Card/Card';
import CardBody from '../../components/Card/CardBody';
import CardHeader from '../../components/Card/CardHeader';
import CardIcon from '../../components/Card/CardIcon';
import CustomInput from '../../components/CustomInput/CustomInput';
import Button from '../../components/CustomButtons/Button';
import CustomNumberFormat from '../../components/CustomNumberFormat/CustomNumberFormat';

import regularFormsStyle from '../../assets/jss/material-dashboard-pro-react/views/regularFormsStyle';

import {
  datesConstant,
  reactTableTextMsg,
  minimumWage,
  contractTypeConstant,
  daysPerMonthByLaborRegime,
} from '../../resources/constants';
import { calculateOffDays, logError } from '../../resources/helpers';

// API resources
import API from '../../resources/api';

moment.locale('es');

const { monthYear } = datesConstant;
const employeeAPI = new API({ url: '/employee' });
employeeAPI.createEntity({ name: 'personal-data' });
employeeAPI.createEntity({ name: 'family' });
employeeAPI.createEntity({ name: 'work' });
employeeAPI.createEntity({ name: 'attendance' });
employeeAPI.createEntity({ name: 'salary' });

// TODO: add read only to fields if salaries has been saved

class MonthlySalaryForm extends React.Component {
  static createEmpleadoColumns(classes) {
    return ({
      Header: 'Empleado',
      headerClassName: classes.headerSeparator,
      columns: [
        {
          Header: 'Codigo',
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
    });
  }
  static createSalaryColumns(classes) {
    return ({
      Header: 'Salario',
      headerClassName: classes.headerSeparator,
      columns: [
        {
          Header: 'Tipo de Contrato',
          accessor: 'contractType',
          Cell: props => {
            const { value } = props;
            if (value) return contractTypeConstant
              .find(type => type.value === value).text;
            return null;
          },
        },
        {
          Header: 'Salario Base',
          accessor: 'wage',
          Cell: props => {
            const { value } = props
            if (value) return Math.round(value).toLocaleString('es-PY');
            return null;
          },
        },
        {
          Header: 'Días trabajados',
          accessor: 'totalWorkedDays',
        },
        {
          Header: 'Salario a pagar',
          accessor: 'paidSalary',
          Cell: props => {
            const { value } = props
            if (value) return Math.round(value).toLocaleString('es-PY');
            return null;
          },
        },
      ],
    });
  }
  static createExtraHoursColumns(classes, header, accessor) {
    return ({
      Header: header,
      headerClassName: classes.headerSeparator,
      columns: [
        {
          Header: 'Horas',
          accessor: accessor.hours,
        },
        {
          Header: 'Monto',
          accessor: accessor.amount,
          Cell: props => {
            const { value } = props
            if (value) return Math.round(value).toLocaleString('es-PY');
            return null;
          },
        },
      ],
    });
  }
  static createUnjustifiedAbsenceColumns(classes) {
    return ({
      Header: 'Ausencias Descontadas',
      headerClassName: classes.headerSeparator,
      columns: [
        {
          Header: 'Días',
          accessor: 'discountedAbsenceDays',
        },
      ],
    });
  }
  static createSuspensionsColumns(classes) {
    return ({
      Header: 'Suspenciones',
      headerClassName: classes.headerSeparator,
      columns: [
        {
          Header: 'Días',
          accessor: 'suspensionDays',
        },
      ],
    });
  }
  static generateEmployeeSalaryObj(employee) {
    const { absence, extraHours } = employee;
    const suspensionDays = (absence
      && absence.suspension
      && absence.suspension.discount
      && absence.suspension.days)
      || 0;
    return {
      employeeId: employee._id || '',
      firstName: employee.firstName || '',
      lastName: employee.lastName || '',
      employeeDocumentId: employee.documentId || '',
      wage: employee.wage || 0,
      contractType: employee.contractType || '',
      attendanceId: employee.attendanceId || '',
      totalWorkedDays: employee.totalWorkedDays || 30,
      paidSalary: employee.paidSalary || 0,
      nightHoursHours: (extraHours && extraHours.nightlyHours) || 0,
      nightHoursAmount: 0,
      dailyExtraHoursHours: (extraHours && extraHours.dailyExtraHours) || 0,
      dailyExtraHoursAmount: 0,
      nightlyExtraHoursHours: (extraHours && extraHours.nightlyExtraHours) || 0,
      nightlyExtraHoursAmount: 0,
      weekendHoursHours: (extraHours && extraHours.sundayHolidaysHours) || 0,
      weekendHoursAmount: 0,
      nightlyWeekendExtraHoursHours: (extraHours && extraHours.sundayHolidaysExtraHours) || 0,
      nightlyWeekendExtraHoursAmount: 0,
      holidayDays: employee.holidayDays || 0,
      holidaysAmount: 0,
      otherIncomes: 0,
      discountedAbsenceDays: employee.discountedAbsenceDays || 0,
      subTotal: 0,
      discountIps: 0,
      discountAdvancePayment: 0,
      discountLoans: 0,
      discountJudicial: 0,
      suspensionDays,
      lateArrivalAmount: 0,
      otherDiscounts: 0,
      familyBonus: 0,
      netToDeposit: 0,
      viaticum: 0,
      parking: 0,
      salaryBump: 0,
      totalPayment: 0,
      laborRegime: employee.laborRegime || 'monthly',
    };
  }
  static calculateSubTotalPayment(employee) {
    const {
      nightHoursAmount,
      dailyExtraHoursAmount,
      nightlyExtraHoursAmount,
      weekendHoursAmount,
      nightlyWeekendExtraHoursAmount,
      holidaysAmount,
      otherIncomes,
      laborRegime,
    } = employee;
    const dailyWage = employee.wage / daysPerMonthByLaborRegime[laborRegime];
    const actualWage = dailyWage * employee.totalWorkedDays;
    const extraHours = nightHoursAmount + dailyExtraHoursAmount
      + nightlyExtraHoursAmount + weekendHoursAmount + nightlyWeekendExtraHoursAmount;
    const subTotal = (actualWage + extraHours + holidaysAmount + otherIncomes);
    return subTotal;
  }
  static calculateNetToDeposit(employee) {
    const {
      subTotal,
      discountIps,
      discountAdvancePayment,
      otherDiscounts,
      discountLoans,
      discountJudicial,
      lateArrivalAmount,
      familyBonus,
    } = employee;
    const discounts = discountIps + discountAdvancePayment + otherDiscounts
      + discountLoans + discountJudicial + lateArrivalAmount;
    const netToDeposit = (subTotal + familyBonus) - discounts;
    return netToDeposit;
  }
  static calculateTotalPayment(employee) {
    const {
      netToDeposit,
      viaticum,
      parking,
      salaryBump,
    } = employee;
    const totalPayment = netToDeposit + viaticum + parking + salaryBump;
    return totalPayment;
  }
  static calculateExtraHours(employee) {
    const newEmployee = Object.assign(employee);
    const { wage, laborRegime } = employee;
    const dailyWage = wage / daysPerMonthByLaborRegime[laborRegime];
    const hourlyDailyWage = dailyWage / 8;
    const nightHourlyWage = hourlyDailyWage * 0.3;
    newEmployee.nightHoursAmount = employee.nightHoursHours * nightHourlyWage;
    newEmployee.dailyExtraHoursAmount = (hourlyDailyWage * 1.5
      * newEmployee.dailyExtraHoursHours);
    newEmployee.nightlyExtraHoursAmount = (hourlyDailyWage + nightHourlyWage)
      * 2 * newEmployee.nightlyExtraHoursHours;
    newEmployee.weekendHoursAmount = hourlyDailyWage * newEmployee.weekendHoursHours;
    newEmployee.nightlyWeekendExtraHoursAmount = (hourlyDailyWage + nightHourlyWage)
    * 2 * newEmployee.nightlyWeekendExtraHoursHours;
    return newEmployee;
  }
  static makeTotalsCalculations(employee) {
    const newEmployee = employee;
    const { contractType } = newEmployee;
    const subTotal = MonthlySalaryForm.calculateSubTotalPayment(newEmployee);
    newEmployee.subTotal = subTotal;
    newEmployee.discountIps = contractType === 'dependent' ? subTotal * 0.09 : 0;
    const netToDeposit = MonthlySalaryForm.calculateNetToDeposit(newEmployee);
    newEmployee.netToDeposit = netToDeposit;
    const totalPayment = MonthlySalaryForm.calculateTotalPayment(newEmployee);
    newEmployee.totalPayment = totalPayment;
    return newEmployee;
  }
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
  }
  state = {
    salaryEntity: {
      monthName: _.startCase(moment().format('MMMM')),
      month: moment().format('MM'),
      year: moment().format('YYYY'),
      employees: [],
    },
    downloadExcelDisabled: true,
  }
  componentDidMount() {
    const month = moment().format('MM');
    const year = moment().format('YYYY');
    employeeAPI.endpoints.salary.getOne({ id: `${month}-${year}` })
      .then(results => results.json())
      .then((data) => {
        const { salaryEntity } = this.state;
        salaryEntity.employees = data;
        this.setState({
          salaryEntity,
          downloadExcelDisabled: data.length < 1,
        });
      })
      .catch(err => logError(err));
  }
  createColumns() {
    const { classes } = this.props
    return [
      MonthlySalaryForm.createEmpleadoColumns(classes),
      MonthlySalaryForm.createSalaryColumns(classes),
      MonthlySalaryForm.createExtraHoursColumns(classes, 'Hrs. Nocturnas', {
        hours: 'nightHoursHours',
        amount: 'nightHoursAmount',
      }),
      MonthlySalaryForm.createExtraHoursColumns(classes, 'Hrs. Extra Diurnas (50%)', {
        hours: 'dailyExtraHoursHours',
        amount: 'dailyExtraHoursAmount',
      }),
      MonthlySalaryForm.createExtraHoursColumns(classes, 'Hrs. Extra Nocturnas (100%)', {
        hours: 'nightlyExtraHoursHours',
        amount: 'nightlyExtraHoursAmount',
      }),
      MonthlySalaryForm.createExtraHoursColumns(classes, 'Hrs. Domingos y Feriados Diurnas', {
        hours: 'weekendHoursHours',
        amount: 'weekendHoursAmount',
      }),
      MonthlySalaryForm.createExtraHoursColumns(classes, 'Hrs. Extra Nocturnas Domingos y Feriados', {
        hours: 'nightlyWeekendExtraHoursHours',
        amount: 'nightlyWeekendExtraHoursAmount',
      }),
      this.createHolidaysColumns(classes),
      {
        columns: [{
          Header: 'Otros Ingresos',
          accessor: 'otherIncomes',
          Cell: row => this.addEditableSingleCell(row, 'otherIncomes'),
        }],
      },
      MonthlySalaryForm.createUnjustifiedAbsenceColumns(classes),
      {
        columns: [{
          Header: 'Sub Total',
          accessor: 'subTotal',
          Cell: props => Math.round(props.value).toLocaleString('es-PY'),
        }],
      },
      {
        columns: [{
          Header: 'IPS',
          accessor: 'discountIps',
          Cell: props => Math.round(props.value).toLocaleString('es-PY'),
        }],
      },
      {
        columns: [{
          Header: 'Anticipos',
          accessor: 'discountAdvancePayment',
          Cell: row => this.addEditableSingleCell(row, 'discountAdvancePayment'),
        }],
      },
      {
        columns: [{
          Header: 'Prestamos',
          accessor: 'discountLoans',
          Cell: row => this.addEditableSingleCell(row, 'discountLoans'),
        }],
      },
      {
        columns: [{
          Header: 'Judicial',
          accessor: 'discountJudicial',
          Cell: row => this.addEditableSingleCell(row, 'discountJudicial'),
        }],
      },
      MonthlySalaryForm.createSuspensionsColumns(classes),
      this.createLateArrivalsColumns(classes),
      {
        columns: [{
          Header: 'Otros Descuentos',
          accessor: 'otherDiscounts',
          Cell: row => this.addEditableSingleCell(row, 'otherDiscounts'),
        }],
      },
      {
        columns: [{
          Header: 'Bonificación Familiar',
          accessor: 'familyBonus',
          Cell: props => Math.round(props.value).toLocaleString('es-PY'),
          // Cell: row => this.addEditableSingleCell(row, 'familyBonus'),
        }],
      },
      {
        columns: [{
          Header: 'Neto a Depositar',
          accessor: 'netToDeposit',
          Cell: props => Math.round(props.value).toLocaleString('es-PY'),
        }],
      },
      this.createUndeclaredIPSColumns(classes),
      {
        Header: 'Total a Pagar',
        accessor: 'totalPayment',
        Cell: props => Math.round(props.value).toLocaleString('es-PY'),
      },
    ];
  }
  createColumns = this.createColumns.bind(this)
  createHolidaysColumns(classes) {
    return ({
      Header: 'Vacaciones',
      headerClassName: classes.headerSeparator,
      columns: [
        {
          Header: 'Días',
          accessor: 'holidayDays',
        },
        {
          Header: 'Monto',
          accessor: 'holidaysAmount',
          Cell: props => {
            const { value } = props
            if (value) return Math.round(value).toLocaleString('es-PY');
            return null;
          },
        },
      ],
    });
  }
  createHolidaysColumns = this.createHolidaysColumns.bind(this)
  createUndeclaredIPSColumns(classes) {
    return ({
      Header: 'Pagos luego de IPS',
      headerClassName: classes.headerSeparator,
      columns: [
        {
          Header: 'Viatico',
          accessor: 'viaticum',
          Cell: row => this.addEditableSingleCell(row, 'viaticum'),
        },
        {
          Header: 'Estacionamiento',
          accessor: 'parking',
          Cell: row => this.addEditableSingleCell(row, 'parking'),
        },
        {
          Header: 'Complemento',
          accessor: 'salaryBump',
          Cell: row => this.addEditableSingleCell(row, 'salaryBump'),
        },
      ],
    });
  }
  createUndeclaredIPSColumns = this.createUndeclaredIPSColumns.bind(this)
  createLateArrivalsColumns(classes) {
    return ({
      Header: 'Llegadas Tardías',
      headerClassName: classes.headerSeparator,
      columns: [
        {
          Header: 'Monto',
          accessor: 'lateArrivalAmount',
          Cell: props => {
            const { value } = props
            if (value) return Math.round(value).toLocaleString('es-PY');
            return null;
          },
        },
      ],
    });
  }
  createLateArrivalsColumns = this.createLateArrivalsColumns.bind(this)
  addEditableSingleCell(row, name) {
    const { salaryEntity } = this.state;
    const { employees } = salaryEntity;
    const value = employees[row.index][name];
    return (
      <CustomInput
        formControlProps={{
          fullWidth: true,
        }}
        inputProps={{
          id: name,
          name,
          inputComponent: CustomNumberFormat,
          value,
          onChange: event =>
            this.singleCellChanged(event, row.index, name),
        }}
      />
    );
  }
  addEditableSingleCell = this.addEditableSingleCell.bind(this)
  singleCellChanged(event, index, name) {
    const { salaryEntity } = this.state;
    const newSalaryEntity = Object.assign({}, salaryEntity);
    const { employees } = newSalaryEntity;
    let employee = employees[index];
    employee[name] = event.target.value * 1;
    employee = MonthlySalaryForm.makeTotalsCalculations(employee);
    this.setState({ salaryEntity: newSalaryEntity });
  }
  singleCellChanged = this.singleCellChanged.bind(this)
  salaryDateChange(momentObj) {
    const { salaryEntity } = this.state;
    let { monthName, month, year } = salaryEntity;
    monthName = _.startCase(momentObj.format('MMMM'));
    month = momentObj.format('MM');
    year = momentObj.format('YYYY');
    const newSalaryEntity = Object.assign({}, salaryEntity, {
      monthName,
      month,
      year,
      employees: [],
    });
    employeeAPI.endpoints.salary.getOne({ id: `${month}-${year}`})
      .then(results => results.json())
      .then((data) => {
        newSalaryEntity.employees = data;
        this.setState({
          salaryEntity: newSalaryEntity,
          downloadExcelDisabled: data.length < 1,
        });
      })
      .catch(err => logError(err));
  }
  salaryDateChange = this.salaryDateChange.bind(this)
  calculateFamilyBonus = childs => {
    const { salaryEntity: { month, year }} = this.state;
    const endOfMonth = moment(moment(`${year}-${month}`).endOf('month')
      .format('YYYY-MM-DD'));
    return childs.reduce((accu, child) => {
      // 0. Check if bonus applies
      if (!child.apply) return accu;
      // 1. Check if childs is younger than 18 years old
      const dob = moment(child.dob);
      const age = endOfMonth.diff(dob, 'years', false); 
      if (age > 17) return accu;
      // 2. Check if bonus start date is less than current date
      const bonusStartDate = moment(child.bonusStartDate);
      if (bonusStartDate.isAfter(endOfMonth)) return accu;
      // 3. Calculate child bonus
      const bonus = minimumWage.monthly * 0.05;
      // console.log(`bonus: ${bonus}, minimum wage: ${minimumWage}`);
      // 4. Return sum with accu
      return accu + bonus;
    }, 0);
  }
  saveClick() {
    const { salaryEntity } = this.state;
    let { month, year, employees } = salaryEntity;

    if (employees.length > 0) {
      const employee = employees[0];
      const params = {
        url: `${month}-${year}`,
        body: salaryEntity,
      };
      let promise;
      if (employee.createdAt !== undefined) {
        promise = employeeAPI.endpoints.salary.updateWithUrl(params);
      } else {
        promise = employeeAPI.endpoints.salary.createWithUrl(params);
      }
      promise.then(results => results.json())
        .then(data => {
          salaryEntity.employees = data;

          this.setState({ salaryEntity, downloadExcelDisabled: false });
        })
        .catch(err => logError(err));
    } else {} // Popup can't save no employee
  }
  saveClick = this.saveClick.bind(this)
  generateClick() {
    const { salaryEntity } = this.state;
    const { month, year } = salaryEntity;
    const promises = [];
    promises.push(employeeAPI.endpoints['personal-data'].getAll());
    promises.push(employeeAPI.endpoints.family.getAll());
    promises.push(employeeAPI.endpoints.work.getAll());
    promises.push(employeeAPI.endpoints['attendance'].getOne({
      id: `${month}-${year}`,
    }));
    Promise.all(promises)
      .then(results => Promise.all(results.map(result => result.json())))
      .then(([personalData, familyData, workData, attendanceData]) => {
        const lastDayDate = new Date(Date.UTC(parseInt(year), (parseInt(month-1))))
        const firstDayObj = moment.utc(lastDayDate).startOf('month');
        const lastDayObj = moment.utc(lastDayDate).endOf('month');
        const newEmployees = personalData.map((person) => {
          const family = familyData
            .find(employeeFamily => employeeFamily.employeeId === person._id);
          const work = workData
            .find(employeeWork => {
              if (employeeWork.employeeId === person._id) {
                if (employeeWork.endDateContract === undefined
                  || employeeWork.endDateContract === null) {
                  return true;
                }
                if (employeeWork.endDateContract > lastDayObj.toJSON()) {
                  return true;
                } else if (employeeWork.endDateContract > firstDayObj.toJSON()) {
                  return true;
                }
              }
              return false;
            });
          const attendance = attendanceData
            .find(personAttendance => personAttendance.employeeId === person._id);
          const newPerson = _.assignWith(person, attendance,
            (objValue, srcValue) => _.isUndefined(objValue) ? srcValue : objValue);
          const { absence } = attendance || { absence: undefined };
          if (absence) {
            newPerson.discountedAbsenceDays = calculateOffDays(absence,
              'discount', true);
            newPerson.suspensionDays = absence && absence.suspension.days;
          }
          if (attendance) {
            newPerson.attendanceId = attendance._id;
            newPerson.holidayDays = attendance.holidayDays;
          }
          newPerson.wage = work && work.monthlySalary;
          newPerson.contractType = work && work.contractType;
          newPerson.laborRegime = work && work.laborRegime;
          const daysPerMonth = work
            ? daysPerMonthByLaborRegime[work.laborRegime] : 30;
          const { lateArrivalHours, lateArrivalMinutes } = newPerson;
          let employee = MonthlySalaryForm.generateEmployeeSalaryObj(newPerson);
          const { wage } = employee;
          const dailyWage = wage / daysPerMonth;
          const hourlyWage = dailyWage / 8;
          const minuteWage = hourlyWage / 60;
          employee = MonthlySalaryForm.calculateExtraHours(employee);
          employee.paidSalary = dailyWage * employee.totalWorkedDays;
          employee.holidaysAmount = dailyWage * employee.holidayDays;
          employee.lateArrivalAmount = (lateArrivalHours * hourlyWage)
            + (lateArrivalMinutes * minuteWage);
          if (family && family.childNumber > 0) {
            employee.familyBonus = this.calculateFamilyBonus(family.childs);
          }
          // Calculate totals once values are set
          employee = MonthlySalaryForm.makeTotalsCalculations(employee);
          if (!work) {
            employee.filterOut = true;
          }
          return employee;
        }).filter(employee => !employee.filterOut);
        salaryEntity.employees = newEmployees;
        this.setState({ salaryEntity });
        return newEmployees;
      })
      .catch(err => logError(err));
  }
  generateClick = this.generateClick.bind(this)
  downloadExcelClick = e => {
    // TODO fix proxy issue for link
    const el = document.getElementById('downloadExcel');
    el.click();
  }
  downloadReceiptsClick = e => {
    // TODO fix proxy issue for link
    const el = document.getElementById('downloadReceipts');
    window.open(el.href, '_blank');
  }
  render() {
    const { classes } = this.props;
    const { salaryEntity, downloadExcelDisabled } = this.state;
    const { employees, monthName, month, year } = salaryEntity;
    const monthYearValue = `${monthName} ${year}`;
    const styles = { 'text-align': 'left' };
    const apiPort = process.env.REACT_APP_API_PORT;
    return (
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="primary" icon>
              <CardIcon color="primary">
                <AttachMoney />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>Salario Mensual {monthName}</h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>
                    Seleccione fecha de salarios
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
                          this.salaryDateChange(momentObj)}
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
                    color="info"
                    onClick={this.generateClick}
                    className={classes.registerButton}
                  >
                    Generar
                  </Button>
                  <Button
                    color="success"
                    disabled={downloadExcelDisabled}
                    className={classes.registerButton}
                    onClick={this.downloadExcelClick}
                  >
                    Descargar excel
                  </Button>
                  <a
                    href={`${window.location.protocol}//${window.location.hostname}:${apiPort}/employee/salary/${month}-${year}/excel`}
                    download
                    style={{ display: 'none' }}
                    id="downloadExcel"
                  >download</a>
                  <Button
                    color="secondary"
                    disabled={downloadExcelDisabled}
                    className={classes.registerButton}
                    onClick={this.downloadReceiptsClick}
                  >
                    Descargar Recibos
                  </Button>
                  <a
                    href={`${window.location.protocol}//${window.location.hostname}:${apiPort}/employee/salary/${month}-${year}/allReceipts`}
                    download
                    style={{ display: 'none' }}
                    id="downloadReceipts"
                  >download</a>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>
                    Salario minimo vigente:
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal} style={{float: 'left'}}>
                    <p>{minimumWage.monthly.toLocaleString('es-PY')}</p>
                  </FormLabel>
                </GridItem>
              </GridContainer>
              <ReactTable
                data={employees}
                filterable
                columns={this.createColumns()}
                defaultPageSize={10}
                showPaginationTop={false}
                showPaginationBottom
                className="-striped -highlight"
                styles={styles}
                previousText={reactTableTextMsg.previousText}
                nextText={reactTableTextMsg.nextText}
                pageText={reactTableTextMsg.pageText}
                ofText={reactTableTextMsg.ofText}
                rowsText={reactTableTextMsg.rowsText}
                noDataText={reactTableTextMsg.noDataTextSalary}
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

export default withStyles(regularFormsStyle)(MonthlySalaryForm);
