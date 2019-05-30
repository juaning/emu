import React from 'react';
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

// core components
import GridContainer from '../../../components/Grid/GridContainer';
import GridItem from '../../../components/Grid/GridItem';
import Card from '../../../components/Card/Card';
import CardBody from '../../../components/Card/CardBody';
import Button from '../../../components/CustomButtons/Button';
import CustomInput from '../../../components/CustomInput/CustomInput';

import {
  logError,
  generateMenuItemList,
} from '../../../resources/helpers';
import {
  paymentConstant,
  bankConstant,
} from '../../../resources/constants';

import regularFormsStyle from '../../../assets/jss/material-dashboard-pro-react/views/regularFormsStyle';

// API resources
import API from '../../../resources/api';

const employeeAPI = new API({ url: '/employee' });
employeeAPI.createEntity({ name: 'payment' });

class PaymentForm extends React.Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
    updateEmployeeData: PropTypes.func.isRequired,
    employee: PropTypes.shape({}).isRequired,
  }
  state = {
    paymentEntity: {
      employeeId: this.props.employeeId || '',
      paymentOption: this.props.employee.paymentOption || '',
      bankName: this.props.employee.bankName || '',
      accountNo: this.props.employee.accountNo || '',
    },
  }
  validateField(event, type) {
    const { value } = event.target;
    const { paymentEntity } = this.state;
    paymentEntity[type] = value;
    this.setState({ paymentEntity });
  }
  validateField = this.validateField.bind(this)
  saveClick = () => {
    const { paymentEntity } = this.state;
    employeeAPI.endpoints.payment.create(paymentEntity)
      .then(response => response.json())
      .then(data => {
        const { errors, errmsg } = data;
        if (errors || errmsg) {
          const err = errors ? errors : errmsg;
          logError(err);
          return;
        }
        this.props.updateEmployeeData(data, 'payment');
      })
      .catch(err => logError(err));
  }
  render() {
    const { classes } = this.props;
    const { paymentEntity } = this.state;
    const paymentOptions = generateMenuItemList(paymentConstant, classes);
    const bankOptions = generateMenuItemList(bankConstant, classes);
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <div>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Formas de pago
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
                        value={paymentEntity.paymentOption}
                        inputProps={{
                          name: 'paymentOption',
                          id: 'paymentOption',
                          onChange: event => this.validateField(event, 'paymentOption'),
                        }}
                        autoWidth
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem,
                          }}
                        >
                          Formas de pago
                        </MenuItem>
                        {paymentOptions}
                      </Select>
                    </FormControl>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Banco
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
                        value={paymentEntity.bankName}
                        inputProps={{
                          name: 'bankName',
                          id: 'bankName',
                          onChange: event => this.validateField(event, 'bankName'),
                        }}
                        autoWidth
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem,
                          }}
                        >
                          Banco
                        </MenuItem>
                        {bankOptions}
                      </Select>
                    </FormControl>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Número de cuenta
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="accountNo"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        name: 'accountNo',
                        id: 'accountNo',
                        required: true,
                        value: paymentEntity.accountNo,
                        onChange: event =>
                          this.validateField(event, 'accountNo'),
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
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles(regularFormsStyle)(PaymentForm);
