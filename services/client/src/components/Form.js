import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';


class Form extends Component {

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        username: '',
        email: '',
        password: ''
      }
    }
  }

  componentDidMount() {
    this.clearForm();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.formType !== nextProps.formType) {
      this.clearForm();
    }
  }

  clearForm = () => {
    this.setState({
      formData: {username: '', email: '', password: ''}
    });
  }

  handleFormChange = (e) => {
    const obj = this.state.formData;
    obj[e.target.name] = e.target.value;
    this.setState(obj);
  }

  handleUserFormSubmit = (e) => {
    e.preventDefault();
    const { formType } = this.props;
    const data = {
      email: this.state.formData.email,
      password: this.state.formData.password
    };
    if (formType === 'Register') {
      data.username = this.state.formData.username;
    };
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/${formType.toLowerCase()}`;
    axios.post(url, data)
      .then((res) => {
        this.clearForm();
        this.props.loginUser(res.data.auth_token);
      })
      .catch((err) => { console.log(err); });
  }

  render() {

    const { formType, isAuthenticated } = this.props;
    const { formData } = this.state;

    if (isAuthenticated) {
      return <Redirect to="/" />
    };
    return (
      <div>
        {formType === 'Login' && 
          <h1 className='title is-1'>Log In</h1>
        }
        {formType === 'Register' &&
          <h1 className='title is-1'>Register</h1>
        }
        <hr/><br/>
        <form onSubmit={this.handleUserFormSubmit}>
          {formType === 'Register' && 
            <div className='field'>
              <input
                name='username'
                className='input is-medium'
                type='text'
                placeholder='Enter a username'
                required
                value={formData.username}
                onChange={this.handleFormChange}
              />
            </div>
          }
          <div className='field'>
            <input
              name='email'
              className='input is-medium'
              type='email'
              placeholder='Enter an email address'
              required
              value={formData.email}
              onChange={this.handleFormChange}
            />
          </div>
          <div className='field'>
            <input
              name='password'
              className='input is-medium'
              type='password'
              placeholder='Enter a password'
              required
              value={formData.password}
              onChange={this.handleFormChange}
            />
          </div>
          <input
            type='submit'
            className='button is-primary is-medium is-fullwidth'
            value='Submit'
          />
        </form>
      </div>
    )
  }
}

export default Form;
