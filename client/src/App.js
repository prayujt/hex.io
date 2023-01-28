import React from 'react';
import Lobby from './components/Lobby/Lobby';
import socket, { postUserReady } from './features/api'
import { useEffect, useState } from 'react';
import Login from './components/Lobby/Login';
import Game from './components/Game/Game';
import { postUser } from "./features/api"
import { generateUUID } from './features/generateUUID';

const io = require('socket.io-client')

const App = () => {
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [username, setUsername] = useState([])
  const [uuid, setUUID] = useState(generateUUID)
  const [isSubmitted, setSubmitStatus] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)


  // establish socket connection
  useEffect(() => {
    setSocket(io('http://' + process.env.REACT_APP_API_URL));
  }, []);

  // subscribe to the socket event
  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      setSocketConnected(socket.connected);
      console.log("Connected")
    });
    socket.on('disconnect', () => {
      setSocketConnected(socket.connected);
    });

    socket.on("gameStarted", (GameState) => {
      setGameStarted(true);
    })

  }, [socket]);


  const handleLoginFormChange = (e) => {
    setUsername(e.target.value)
  }

  const handleLoginSubmit = () => {
    let newPlayer = {
      uuid: uuid,
      username: username
    };
    postUser(newPlayer);
    setSubmitStatus(true);
  };

  if (isSubmitted) return gameStarted ? <Game/> : <Lobby uuid={uuid} />
  else return <Login uuid={uuid} handleOnChange={handleLoginFormChange} handleSubmit={handleLoginSubmit} />
}

export default App;
