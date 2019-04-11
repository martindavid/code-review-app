import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import UsersList from './components/UsersList';
import AddUser from './components/AddUser';
import Navbar from './components/Navbar';
import About from './components/About';
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
      }
    }
  }

  componentDidMount(){
    this.getUsers();
  }

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

  handleChange = (e) => {
    const obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
  };

  getUsers() {
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
      .then((res) => { 
        this.setState({ users: res.data.data.users});
        console.log(res);
      })
      .catch((err) => { console.log(err); })
  }

  render() {
    const { email, username, title, formData } = this.state;
    return (
      <React.Fragment>
        <Navbar title={title} />
        <section className="section">
          <div className='container'>
            <div className='columns'>
              <div className='column is-half'>
                <br/>
                <Switch>
                  <Route exact path='/' render={() => (
                    <div>
                      <h1 className='title is-1'>All Users</h1>
                      <hr/><br/>
                      <AddUser
                        addUser={this.addUser}
                        email={email}
                        username={username}
                        handleChange={this.handleChange}
                      />
                      <hr/><br/>
                      <UsersList users={this.state.users} />
                    </div>
                  )}/>
                 <Route exact path='/about' component={About} />
                 <Route exact path='/register' render={() => (
                   <Form
                     formType={'Register'}
                     formData={formData}
                   />
                 )} />
                 <Route exact path='/login' render={() => (
                   <Form
                     formType={'Login'}
                     formData={formData}
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
