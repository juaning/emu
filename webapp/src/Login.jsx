import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';

require('dotenv').config();

const style = {
  margin: 15,
};

class Login extends React.Component {
  state = {
    username: '',
    password: '',
  }

  handleClick() {
    const payload = {
      username: this.state.username,
      password: this.state.password,
    };

    // axios.post(`${apiBaseUrl}/login`, payload)
    axios.post('/login', payload)
      // .then(response => response.json())
      .then((loginResponse) => {
        console.log(loginResponse);
        if (loginResponse.status === 200) console.log('Login successful');
        else if (loginResponse.status === 204) console.log('Username-Password do not match');
        else console.log('Username does not exists');
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <AppBar title="Login" />
            <TextField
              hintText="Agregar nombre de usuario"
              floatingLabelText="Usuario"
              value={this.state.username}
              onChange={(event, newValue) => this.setState({ username: newValue })}
            />
            <br />
            <TextField
              type="password"
              hintText="Ingrese su password"
              floatingLabelText="Password"
              value={this.state.password}
              onChange={(event, newValue) => this.setState({ password: newValue })}
            />
            <br />
            <RaisedButton
              label="Enviar"
              primary
              style={style}
              onClick={event => this.handleClick(event)}
            />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default Login;
