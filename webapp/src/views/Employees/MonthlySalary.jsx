import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import Datetime from 'react-datetime';
import moment from 'moment';
import 'moment/locale/es';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import FormLabel from '@material-ui/core/FormLabel';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Switch from '@material-ui/core/Switch';

// @material-ui/icons
import AttachMoney from '@material-ui/icons/AttachMoney';

// core components
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import Card from '../../components/Card/Card';
import CardBody from '../../components/Card/CardBody';
import CardHeader from '../../components/Card/CardHeader';
import CardIcon from '../../components/Card/CardIcon';
// import CustomInput from '../../components/CustomInput/CustomInput';
import Button from '../../components/CustomButtons/Button';

import regularFormsStyle from '../../assets/jss/material-dashboard-pro-react/views/regularFormsStyle';

import {
  datesConstant,
  reactTableTextMsg,
  minimumWage,
} from '../../resources/constants';

moment.locale('es');

const { monthYear } = datesConstant;

class MonthlySalaryForm extends React.Component {
  static createColumns() {
    return [
      MonthlySalaryForm.createEmpleadoColumns(),
      {
        columns: [{
          Header: 'Días trabajados',
          accessor: 'workedDays',
        }],
      },
      MonthlySalaryForm.createExtraHoursColumns('Hrs. Nocturnas'),
      MonthlySalaryForm.createExtraHoursColumns('Hrs. Extra Diurnas (50%)'),
      MonthlySalaryForm.createExtraHoursColumns('Hrs. Extra Nocturnas (100%)'),
      MonthlySalaryForm.createExtraHoursColumns('Hrs. Domingos y Feriados Diurnas'),
      MonthlySalaryForm.createExtraHoursColumns('Hrs. Extra Nocturnas Domingos y Feriados'),
      MonthlySalaryForm.createHolidaysColumns(),
      {
        columns: [{
          Header: 'Otros Ingresos',
          accessor: 'otherIncomes',
        }],
      },
      MonthlySalaryForm.createUnjustifiedAbsenceColumns(),
      {
        columns: [{
          Header: 'Sub Total',
          accessor: 'subTotal',
        }],
      },
      {
        columns: [{
          Header: 'IPS',
          accessor: 'ips',
        }],
      },
      {
        columns: [{
          Header: 'Anticipos',
          accessor: 'advancePayment',
        }],
      },
      {
        columns: [{
          Header: 'Prestamos',
          accessor: 'loans',
        }],
      },
      {
        columns: [{
          Header: 'Judicial',
          accessor: 'judicial',
        }],
      },
      MonthlySalaryForm.createSuspensionsColumns(),
      MonthlySalaryForm.createLateArrivalsColumns(),
      {
        columns: [{
          Header: 'Otros Descuentos',
          accessor: 'otherDiscounts',
        }],
      },
      {
        columns: [{
          Header: 'Bonificación Familiar',
          accessor: 'familyBonus',
        }],
      },
      {
        columns: [{
          Header: 'Neto a Depositar',
          accessor: 'netToDeposit',
        }],
      },
      MonthlySalaryForm.createUndeclaredIPSColumns(),
      {
        Header: 'Total a Pagar',
        accessor: 'totalPayment',
      },
    ];
  }
  static createEmpleadoColumns() {
    return ({
      Header: 'Empleado',
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
  static createExtraHoursColumns(header) {
    return ({
      Header: header,
      columns: [
        {
          Header: 'Horas',
          accessor: 'hours',
        },
        {
          Header: 'Monto',
          accessor: 'amount',
        },
      ],
    });
  }
  static createHolidaysColumns() {
    // TODO: this should be editable
    return ({
      Header: 'Vacaciones',
      columns: [
        {
          Header: 'Días',
          accessor: 'days',
        },
        {
          Header: 'Monto',
          accessor: 'value',
        },
      ],
    });
  }
  static createUnjustifiedAbsenceColumns() {
    return ({
      Header: 'Ausencias Injustificadas',
      columns: [
        {
          Header: 'Días',
          accessor: 'days',
        },
        {
          Header: 'Monto',
          accessor: 'value',
        },
      ],
    });
  }
  static createSuspensionsColumns() {
    return ({
      Header: 'Suspenciones',
      columns: [
        {
          Header: 'Días',
          accessor: 'days',
        },
        {
          Header: 'Monto',
          accessor: 'value',
        },
      ],
    });
  }
  static createLateArrivalsColumns() {
    return ({
      Header: 'Llegadas Tardías',
      columns: [
        {
          Header: 'Horas',
          accessor: 'hours',
        },
        {
          Header: 'Minutos',
          accessor: 'minutes',
        },
        {
          Header: 'Monto',
          accessor: 'value',
        },
      ],
    });
  }
  static createUndeclaredIPSColumns() {
    return ({
      Header: 'Pagos a Realizarse sin Declarar en IPS',
      columns: [
        {
          Header: 'Viatico',
          accessor: 'viaticum',
        },
        {
          Header: 'Estacionamiento',
          accessor: 'parking',
        },
        {
          Header: 'Aumento de Salario',
          accessor: 'salaryBump',
        },
      ],
    });
  }
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
  }
  state = {
    salaryEntity: {
      monthName: moment().format('MMMM'),
      month: moment().format('MM'),
      year: moment().format('YYYY'),
      employees: [],
    },
  }
  render() {
    const { classes } = this.props;
    const { salaryEntity } = this.state;
    const { employees, monthName, year } = salaryEntity;
    const monthYearValue = `${monthName} ${year}`;
    const styles = { 'text-align': 'left' };
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
                    color="info"
                    onClick={this.generateClick}
                    className={classes.registerButton}
                  >
                    Generar
                  </Button>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>
                    Salario minimo vigente:
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={2}>{minimumWage.monthly.toLocaleString('es-PY')}</GridItem>
              </GridContainer>
              <ReactTable
                data={employees}
                filterable
                columns={MonthlySalaryForm.createColumns()}
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
