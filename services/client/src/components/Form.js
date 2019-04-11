import React from 'react';

const Form = (props) => {
  const { formType, formData, handleUserFormSubmit, handleFormChange } = props;
  return (
    <div>
      {formType === 'Login' && 
        <h1 className='title is-1'>Log In</h1>
      }
      {formType === 'Register' &&
        <h1 className='title is-1'>Register</h1>
      }
      <hr/><br/>
      <form onSubmit={handleUserFormSubmit}>
        {formType === 'Register' && 
          <div className='field'>
            <input
              name='username'
              className='input is-medium'
              type='text'
              placeholder='Enter a username'
              required
              value={formData.username}
              onChange={handleFormChange}
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
            onChange={handleFormChange}
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
            onChange={handleFormChange}
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

export default Form;
