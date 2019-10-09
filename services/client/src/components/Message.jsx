import React from "react";

const Message = ({ messageType, messageName, removeMessage }) => {
  return (
    <div className={`notification is-${messageType}`}>
      <button
        type="button"
        className="delete"
        onClick={() => {
          removeMessage();
        }}
      ></button>
      <span>{messageName}</span>
    </div>
  );
};

export default Message;
