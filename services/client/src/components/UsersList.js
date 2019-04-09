import React from 'react';


const UsersList = ({users}) => {
  return (
    <div>
      {
        users.map((user) => {
          return (
            <h4 key={user.id} className='box title is-4'>{user.username}</h4>
          )
        })
      }
    </div>
  );
}

export default UsersList;
