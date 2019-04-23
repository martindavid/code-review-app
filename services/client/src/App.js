import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import UsersList from './components/UsersList';
import Navbar from './components/Navbar';
import About from './components/About';
import Logout from './components/Logout';
import UserStatus from './components/UserStatus';
import Form from './components/forms/Form';


class App extends Component {

  constructor(){
    super();
    this.state = {
      users: [],
      title: 'Code Review App',
      isAuthenticated: false
    }
  };

  componentWillMount() {
    if (window.localStorage.getItem('authToken')) {
      this.setState({ isAuthenticated: true });
    }
  }

  componentDidMount(){
    this.getUsers();
  };

  getUsers = () => {
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
      .then((res) => { 
        this.setState({ users: res.data.data.users});
      })
      .catch((err) => { console.log(err); })
  };

  logoutUser = () => {
    window.localStorage.clear();
    this.setState({ isAuthenticated: false });
  }

  loginUser = (token) => {
    window.localStorage.setItem('authToken', token);
    this.setState({ isAuthenticated: true });
    this.getUsers();
  }

  render() {
    const {  isAuthenticated, title } = this.state;
    return (
      <React.Fragment>
        <Navbar title={title} isAuthenticated={isAuthenticated} />
        <section className="section">
          <div className='container'>
            <div className='columns'>
              <div className='column is-half'>
                <br/>
                <Switch>
                  <Route exact path='/' render={() => (
                      <UsersList users={this.state.users} />
                  )}/>
                  <Route exact path='/about' component={About} />
                  <Route exact path='/register' render={() => (
                    <Form
                      formType={'Register'}
                      isAuthenticated={isAuthenticated}
                      loginUser={this.loginUser}
                    />
                  )} />
                <Route exact path='/status' render={() => (
                  <UserStatus isAuthenticated={isAuthenticated} />
                )} />
                  <Route exact path='/login' render={() => (
                    <Form
                      formType={'Login'}
                      loginUser={this.loginUser}
                      isAuthenticated={isAuthenticated}
                    />
                  )} />
                  <Route exact path='/logout' render={() => (
                    <Logout
                      logoutUser={this.logoutUser}
                      isAuthenticated={isAuthenticated}
                    />
                  )} />
                </Switch>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    )
  }
}

export default App;
