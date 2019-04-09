import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import * as serviceWorker from './serviceWorker';

import UsersList from './components/UsersList';


class App extends Component {

  constructor(){
    super();
    this.state = {
      users: []
    }
  }

  componentDidMount(){
    this.getUsers();
  }

  getUsers() {
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
      .then((res) => { 
        this.setState({ users: res.data.data.users});
        console.log(res);
      })
      .catch((err) => { console.log(err); })
  }

  render() {
    return (
      <section className="section">
        <div className='container'>
          <div className='columns'>
            <div className='column is-one-third'>
              <br/>
              <h1 className='title is-1 is-1'>All Users</h1>
              <hr/><br/>
              <UsersList users={this.state.users} />
            </div>
          </div>
        </div>
      </section>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
