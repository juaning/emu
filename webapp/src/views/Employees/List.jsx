import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
// @material-ui/icons
import Create from '@material-ui/icons/Create';
import Close from '@material-ui/icons/Close';
// core components
import GridItem from '../../components/Grid/GridItem';
import Table from '../../components/Table/Table';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import Button from '../../components/CustomButtons/Button';
import AlertDialog from '../../components/Dialog/AlertDialog';
// API resources
import API from '../../resources/api';

const styles = {
  cardCategoryWhite: {
    '&,& a,& a:hover,& a:focus': {
      color: 'rgba(255,255,255,.62)',
      margin: '0',
      fontSize: '14px',
      marginTop: '0',
      marginBottom: '0',
    },
    '& a,& a:hover,& a:focus': {
      color: '#FFFFFF',
    },
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: '#777',
      fontSize: '65%',
      fontWeight: '400',
      lineHeight: '1',
    },
  },
};

const employeeAPI = new API({ url: '/employee' });
employeeAPI.createEntity({ name: 'personal-data' });

class TableList extends React.Component {
  state = {
    personalData: [],
    showDialog: false,
  }
  componentDidMount() {
    employeeAPI.endpoints['personal-data'].getAll()
      .then(results => results.json())
      .then(data => this.setState({ personalData: data }))
      .catch(err => console.error(err));
  }
  btnEditClicked = this.btnEditClicked.bind(this);
  btnEditClicked({ id, name }) {
    const { history } = this.props;
    history.push({
      pathname: '/empleados/editar',
      search: `?empleado=${id}`,
    });
  }
  btnRemoveClicked = this.btnRemoveClicked.bind(this);
  btnRemoveClicked({ id, name }) {
    this.setState({ showDialog: true, name, id });
  }
  deleteEmployee = this.deleteEmployee.bind(this)
  deleteEmployee(employeeId) {
    return employeeAPI.endpoints['personal-data'].delete({
      id: employeeId,
    })
      .then(result => result.json())
      .then(() => {
        const personalData = this.state.personalData
          // eslint-disable-next-line no-underscore-dangle
          .filter(persona => persona._id !== employeeId);
        this.setState({ personalData });
      })
      .catch(err => console.error(err));
  }
  render() {
    const { classes } = this.props;
    const randomInt = max => Math.floor(Math.random() * Math.floor(max));
    const tableData = this.state.personalData.map((data) => {
      const name = `${data.firstName} ${data.lastName}`;
      // eslint-disable-next-line no-underscore-dangle
      const id = data._id;
      return Object.values({
        name,
        country: data.nationality,
        email: data.email,
        salary: numeral(randomInt(10000000)).format('$0,0'),
        actions: (
          <div className="actions-right">
            { /* use this button to add a edit kind of action */ }
            <Button
              justIcon
              round
              simple
              onClick={() => this.btnEditClicked({ id, name })}
              color="info"
              customClass="edit"
            >
              <Create />
            </Button>{' '}
            { /* use this button to remove the data row */ }
            <Button
              justIcon
              round
              simple
              onClick={() => this.btnRemoveClicked({ id, name })}
              color="danger"
              customClass="remove"
            >
              <Close />
            </Button>{' '}
          </div>
        ),
      });
    });
    return (
      <Grid container>
        <AlertDialog
          showDialog={this.state.showDialog}
          name={this.state.name}
          personalDataID={this.state.id}
          onClickDeleteEmployee={this.deleteEmployee}
        />
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Lista de empleados</h4>
              <p className={classes.cardCategoryWhite}>
                Listado basico de empleados
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={['Nombre', 'Pais', 'E-mail', 'Salario', 'Acciones']}
                tableData={tableData}
              />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    );
  }
}

TableList.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(TableList);
