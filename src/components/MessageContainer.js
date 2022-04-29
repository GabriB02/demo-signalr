import React, { useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';

const MessageContainer = ({ messages, readNewMessage }) => {
  const messageRef = useRef();

  useEffect(() => {
    if (messageRef && messageRef.current) {
      const { scrollHeight, clientHeight } = messageRef.current;
      messageRef.current.scrollTo({ left: 0, top: scrollHeight - clientHeight, behavior: 'smooth' });
    }
  }, [messages]);
  return (
    <div ref={messageRef} className="message-container">
      {messages.map((m, index) => {
        return (
          <div key={index} className="user-message">
            <div className="message bg-primary" style={{ bgColor: m['_isRead'] && '#111111' }}>
              {m['_Content']}
            </div>
            <div className="from-user">
              {m['_Sender']}
              {!m['_isRead'] ? (
                <Button variant="text" onClick={() => readNewMessage(m['_Id'])}>
                  mark as read
                </Button>
              ) : (
                'Letto'
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageContainer;
