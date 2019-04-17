import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import UsersList from './components/UsersList';
import Navbar from './components/Navbar';
import About from './components/About';
import Logout from './components/Logout';
import UserStatus from './components/UserStatus';
import Form from './components/Form';


class App extends Component {

  constructor(){
    super();
    this.state = {
      users: [],
      username: '',
      email: '',
      title: 'Code Review App',
      formData: {
        username: '',
        email: '',
        password: ''
      },
      isAuthenticated: false
    }
  };

  componentDidMount(){
    this.getUsers();
  };

  addUser = (e) => {
    e.preventDefault();
    const data = {
      username: this.state.username,
      email: this.state.email,
    };
    axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`, data)
      .then((res) => {
        this.getUsers();
        this.setState({ username: '', email: '' })
      }) 
      .catch((err) => console.log(err));
  };

  clearFormState = () => {
    this.setState({
      formData: {username: '', email: '', password: ''},
      username: '',
      email: ''
    });
  };

  handleChange = (e) => {
    const obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
  };

  handleFormChange = (e) => {
    var formData = this.state.formData;
    formData[e.target.name] = e.target.value;
    this.setState(formData);
  };

  handleUserFormSubmit = (e) => {
    e.preventDefault();
    const { formData } = this.state;
    const formType = window.location.href.split('/').reverse()[0]
    let data = {
      email: formData.email,
      password: formData.password
    }
    if (formType === 'register') {
      data.username = formData.username;
    }

    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/${formType}`;
    axios.post(url, data)
      .then((res) => {
        this.clearFormState();
        window.localStorage.setItem('authToken', res.data.auth_token);
        this.setState({ isAuthenticated: true });
        this.getUsers();
      })
      .catch((err) => {
        console.log(err);
      })
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

  render() {
    const { email, username, title, formData, isAuthenticated } = this.state;
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
                      formData={formData}
                      handleFormChange={this.handleFormChange}
                      handleUserFormSubmit={this.handleUserFormSubmit}
                      isAuthenticated={isAuthenticated}
                    />
                  )} />
                <Route exact path='/status' render={() => (
                  <UserStatus isAuthenticated={isAuthenticated} />
                )} />
                  <Route exact path='/login' render={() => (
                    <Form
                      formType={'Login'}
                      formData={formData}
                      handleFormChange={this.handleFormChange}
                      handleUserFormSubmit={this.handleUserFormSubmit}
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
