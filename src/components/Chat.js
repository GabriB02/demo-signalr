import React from 'react';
import MessageContainer from './MessageContainer';
import SendMessageForm from './SendMessageForm';
import { Button } from 'react-bootstrap';
import ConnectedUsers from './ConnectedUsers';

const Chat = ({ messages, sendMessage, closeConnection, users, readNewMessage }) => (
  <div>
    <h2>Messaggi non letti: {messages?.filter((x) => !x._isRead && x._Type === 'normal').length}</h2>
    <div className="leave-room">
      <Button variant="danger" onClick={() => closeConnection()}>
        Leave
      </Button>
    </div>
    <ConnectedUsers users={users} />
    <div className="chat">
      <MessageContainer messages={messages} readNewMessage={readNewMessage} />
      <SendMessageForm sendMessage={sendMessage} />
    </div>
  </div>
);
export default Chat;
