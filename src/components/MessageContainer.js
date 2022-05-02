import React, { useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../Atoms';

const MessageContainer = ({ messages, readNewMessage }) => {
  const messageRef = useRef();
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    if (messageRef && messageRef.current) {
      const { scrollHeight, clientHeight } = messageRef.current;
      messageRef.current.scrollTo({ left: 0, top: scrollHeight - clientHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const messageStatus = (mex) => {
    const button = (
      <Button variant="text" onClick={() => readNewMessage(mex['_Id'])}>
        Mark as read
      </Button>
    );
    if (mex['_Sender'] !== 'MyChat Bot' && mex['_Sender'] !== user) {
      if (!mex['_isRead']) return button;
      else return 'Read';
    }
  };

  return (
    <div ref={messageRef} className="message-container">
      {messages.map((m, index) => {
        return (
          <div key={index} className="user-message">
            <div className="message bg-primary" style={{ bgColor: m['_isRead'] && '#111111' }}>
              {m['_Content']}
            </div>
            <div className="from-user">
              {m['_Sender'] === user ? 'You' : m['_Sender']}
              {messageStatus(m)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageContainer;
