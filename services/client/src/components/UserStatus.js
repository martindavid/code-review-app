import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class UserStatus extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      id: '',
      username: '',
      active: '',
      admin: ''
    }
  };

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.getUserStatus();
    }
  }

  getUserStatus = (e) => {
    const options = {
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/status`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.localStorage.authToken}`
      }
    }

    return axios(options)
      .then((res) => this.setState({
        email: res.data.data.email,
        id: res.data.data.id,
        username: res.data.data.username,
        admin: String(res.data.data.admin),
        active: String(res.data.data.active)
      }))
      .catch((err) => console.log(err))
  }

  render() {
    const { email, id, username, active, admin } = this.state;
    if (!this.props.isAuthenticated) {
      return (
        <p>You must be logged in to view this. Click <Link to='/login'>here</Link> to log back in</p>
      );
    }
    return (
      <div>
        <ul>
          <li><strong>User ID: </strong>{id}</li>
          <li><strong>Email: </strong>{email}</li>
          <li><strong>Username: </strong>{username}</li>
          <li><strong>Active: </strong>{active}</li>
          <li><strong>Admin: </strong>{admin}</li>
        </ul>
      </div>
    );
  }
}

export default UserStatus;
