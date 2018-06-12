import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './App.css';
import LoginScreen from './LoginScreen';

injectTapEventPlugin();

class App extends Component {
  state = {
    loginPage: [],
  }

  componentWillMount() {
    const loginPage = [];
    loginPage.push(<LoginScreen parentContext={this} key="loginScreen" />);
    this.setState({ loginPage });
  }

  render() {
    return (
      <div className="App">
        {this.state.loginPage}
      </div>
    );
  }
}

export default App;
