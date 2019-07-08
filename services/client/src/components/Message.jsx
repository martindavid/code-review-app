import React from 'react';

const Message = ({messageType, messageName}) => {
  return (
    <div className={`notification is-${messageType}`}>
      <button type="button" className="delete"></button>
      <span>{messageName}</span>
    </div>
  );
};

export default Message;
