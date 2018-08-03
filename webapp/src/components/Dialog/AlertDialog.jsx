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

class AlertDialog extends React.Component {
  state = {
    open: this.props.showDialog,
    personalDataID: this.props.personalDataID,
    parentDeleteEmployee: this.props.onClickDeleteEmployee,
  }

  componentWillReceiveProps(props) {
    this.setState({
      open: props.showDialog,
      personalDataID: props.personalDataID,
      parentDeleteEmployee: props.onClickDeleteEmployee,
    });
  }

  handleClose = this.handleClose.bind(this)
  handleClose() {
    this.setState({ open: false });
  }

  deleteEmployee = this.deleteEmployee.bind(this)
  deleteEmployee() {
    this.state.parentDeleteEmployee(this.state.personalDataID).then(() => {
      this.handleClose();
    });
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
  onClickDeleteEmployee: PropTypes.func,
};

AlertDialog.defaultProps = {
  showDialog: false,
  name: '',
  personalDataID: '',
  onClickDeleteEmployee: () => {},
};

export default AlertDialog;
