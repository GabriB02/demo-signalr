import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Lobby from './components/Lobby';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import Chat from './components/Chat';

const App = () => {
  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const joinRoom = async (user, room) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl('https://localhost:7261/chat')
        .configureLogging(LogLevel.Information)
        .build();

      connection.on('UsersInRoom', (users) => {
        setUsers(users);
      });

      //connection on o standardizzare cosa si manda come payload o cambiare il nome del metodo di ritorno in base a cosa si richiede
      connection.on('ReceiveMessage', (messageJson) => {
        setMessages((messages) => [...messages, { ...messageJson }]);
        console.log('message received: ', messageJson);
      });

      connection.onclose((e) => {
        setConnection();
        setMessages([]);
        setUsers([]);
      });
      await connection.start();
      await connection.invoke('JoinRoom', { user, room });
      setConnection(connection);
    } catch (e) {
      console.log(e);
    }
  };

  const sendMessage = async (message) => {
    try {
      await connection.invoke('SendMessage', message);
    } catch (e) {
      console.log(e);
    }
  };

  const closeConnection = async () => {
    try {
      await connection.stop();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="app">
      <h2>MyChat</h2>
      <hr className="line" />
      {connection ? (
        <Chat messages={messages} sendMessage={sendMessage} closeConnection={closeConnection} users={users} />
      ) : (
        <Lobby joinRoom={joinRoom} />
      )}
    </div>
  );
};

export default App;
