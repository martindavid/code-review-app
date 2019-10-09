import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import axios from 'axios';
import UsersList from './components/UsersList';
import Navbar from './components/Navbar';
import About from './components/About';
import Logout from './components/Logout';
import UserStatus from './components/UserStatus';
import Form from './components/forms/Form';
import Message from './components/Message';

class App extends Component {
  state = {
    users: [],
    title: 'Code Review App',
    isAuthenticated: window.localStorage.getItem('authToken') ? true : false,
    messageName: null,
    messageType: null,
  };

  componentDidMount() {
    this.getUsers();
  }

  createMessage = (name = 'Sanity Check', type = 'success') => {
    this.setState({
      messageName: name,
      messageType: type,
    });

    setTimeout(() => {
      this.removeMessage();
    }, 3000);
  };

  removeMessage = () => {
    this.setState({
      messageName: null,
      messageType: null,
    });
  };

  getUsers = () => {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
      .then(res => {
        this.setState({users: res.data.data.users});
      })
      .catch(err => {
        console.log(err);
      });
  };

  logoutUser = () => {
    window.localStorage.clear();
    this.setState({isAuthenticated: false});
  };

  loginUser = token => {
    window.localStorage.setItem('authToken', token);
    this.setState({isAuthenticated: true});
    this.getUsers();
    this.createMessage('Welcome!', 'success');
  };

  render() {
    const {isAuthenticated, title, messageType, messageName} = this.state;
    return (
      <React.Fragment>
        <Navbar title={title} isAuthenticated={isAuthenticated} />
        <section className="section">
          <div className="container">
            {messageType && messageName && (
              <Message
                removeMessage={this.removeMessage}
                messageName={messageName}
                messageType={messageType}
              />
            )}
            <div className="columns">
              <div className="column is-half">
                <br />
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() => <UsersList users={this.state.users} />}
                  />
                  <Route exact path="/about" component={About} />
                  <Route
                    exact
                    path="/register"
                    render={() => (
                      <Form
                        formType={'Register'}
                        isAuthenticated={isAuthenticated}
                        loginUser={this.loginUser}
                        createMessage={this.createMessage}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/status"
                    render={() => (
                      <UserStatus isAuthenticated={isAuthenticated} />
                    )}
                  />
                  <Route
                    exact
                    path="/login"
                    render={() => (
                      <Form
                        formType={'Login'}
                        loginUser={this.loginUser}
                        isAuthenticated={isAuthenticated}
                        createMessage={this.createMessage}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/logout"
                    render={() => (
                      <Logout
                        logoutUser={this.logoutUser}
                        isAuthenticated={isAuthenticated}
                      />
                    )}
                  />
                </Switch>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default App;
