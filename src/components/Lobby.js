import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { userAtom, roomAtom } from '../Atoms';

const Lobby = ({ joinRoom }) => {
  const [user, setUser] = useRecoilState(userAtom);
  const [room, setRoom] = useRecoilState(roomAtom);

  return (
    <Form
      className="lobby"
      onSubmit={(e) => {
        e.preventDefault();
        joinRoom(user, room);
      }}
    >
      <Form.Group>
        <Form.Control placeholder="name" onChange={(e) => setUser(e.target.value)} />
        <Form.Control placeholder="room" onChange={(e) => setRoom(e.target.value)} />
      </Form.Group>
      <Button variant="success" type="submit" disabled={!user || !room}>
        Join
      </Button>
    </Form>
  );
};

export default Lobby;
