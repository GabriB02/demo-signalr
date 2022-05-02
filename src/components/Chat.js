import React from 'react';
import MessageContainer from './MessageContainer';
import SendMessageForm from './SendMessageForm';
import { Button } from 'react-bootstrap';
import ConnectedUsers from './ConnectedUsers';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../Atoms';

const Chat = ({ messages, sendMessage, closeConnection, users, readNewMessage }) => {
  const user = useRecoilValue(userAtom);
  return (
    <div>
      <h3>
        Unread messages: {messages?.filter((x) => !x._isRead && x._Type === 'normal' && x._Sender !== user).length}
      </h3>
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
};

export default Chat;
