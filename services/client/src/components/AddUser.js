import React from 'react';


const AddUser = ({ addUser, username, email, handleChange }) => {
  return (
    <form onSubmit={addUser}>
      <div className='field'>
        <input
          name='username'
          className='input is-large'
          type='text'
          placeholder='Enter a username'
          required
          value={username}
          onChange={handleChange}
        />
      </div>
      <div className='field'>
        <input
          name='email'
          className='input is-large'
          type='email'
          placeholder='Enter an email address'
          required
          value={email}
          onChange={handleChange}
        />
      </div>
      <div className='field'>
        <input
          type='submit'
          className='button is-primary is-large is-full-width'
          value='Submit'
        />
      </div>
    </form>
  )
}

export default AddUser;
