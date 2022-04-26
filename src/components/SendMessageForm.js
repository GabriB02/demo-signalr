import React, { useState } from 'react';
import { FormControl, InputGroup, Form, Button } from 'react-bootstrap';

const SendMessageForm = ({ sendMessage }) => {
  const [message, setMessage] = useState('');
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(message);
        setMessage('');
      }}
    >
      <InputGroup>
        <FormControl placeholder="message..." value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button variant="primary" type="submit" disabled={!message}>
          Send
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SendMessageForm;
