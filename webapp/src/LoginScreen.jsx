import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import Login from './Login';

const style = {
  margin: 15,
};

class LoginScreen extends Component {
  state = {
    loginScreen: [],
    loginMessage: '',
    buttonLabel: 'Register',
    isLogin: true,
  }

  componentWillMount() {
    const loginScreen = [];
    loginScreen.push(<Login
      parentContext={this}
      appContext={this.props.parentContext}
      key="login"
    />);
    const loginMessage = 'Registrese';
    this.setState({
      loginScreen,
      loginMessage,
    });
  }

  handleClick() {
    let loginMessage;
    if (this.state.isLogin) {
      loginMessage = 'Ya esta registrado. Vaya al login';
      this.setState({
        loginMessage,
        buttonLabel: 'Login',
        isLogin: false,
      });
    }
  }

  render() {
    return (
      <div className="loginScreen">
        {this.state.loginScreen}
        <div>
          {this.state.loginMessage}
          <MuiThemeProvider>
            <div>
              <RaisedButton
                label={this.state.buttonLabel}
                primary
                style={style}
                onClick={(event => this.handleClick(event))}
              />
            </div>
          </MuiThemeProvider>
        </div>
      </div>
    );
  }
}

LoginScreen.propTypes = {
  parentContext: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

LoginScreen.defaultProps = {
  parentContext: {},
};

export default LoginScreen;
