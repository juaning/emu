import React from 'react';
import PropTypes from 'prop-types';
// import @material-ui/core
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// import @material-ui/icons
import ErrorOutline from '@material-ui/icons/ErrorOutline';
// API resources
import API from '../../resources/api';

const employeeAPI = new API({ url: '' });
employeeAPI.createEntity({ name: 'personal-data' });

class AlertDialog extends React.Component {
  state = {
    open: this.props.showDialog,
    personalDataID: this.props.personalDataID,
  }

  componentWillReceiveProps(props) {
    this.setState({
      open: props.showDialog,
      personalDataID: props.personalDataID,
    });
  }

  handleClose = this.handleClose.bind(this)
  handleClose() {
    this.setState({ open: false });
  }

  deleteEmployee = this.deleteEmployee.bind(this)
  deleteEmployee() {
    employeeAPI.endpoints['personal-data'].delete({ id: this.state.personalDataID })
      .then(result => result.json())
      .then((data) => {
        console.log(data);
        this.handleClose();
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            <ErrorOutline color="primary" style={{ fontSize: '72px' }} />{' '}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Esta seguro que desea eliminar a {this.props.name}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              No
            </Button>
            <Button onClick={this.deleteEmployee} color="primary" autoFocus>
              Si
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

AlertDialog.propTypes = {
  showDialog: PropTypes.bool,
  name: PropTypes.string,
  personalDataID: PropTypes.string,
};

AlertDialog.defaultProps = {
  showDialog: false,
  name: '',
  personalDataID: '',
};

export default AlertDialog;
