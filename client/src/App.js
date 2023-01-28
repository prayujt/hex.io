import React from 'react';
import Lobby from './components/Lobby/Lobby';
import socket from './features/api'
import { useEffect } from 'react';
import Login from './components/Lobby/Login';
import Game from './components/Game/Game';
import {v4 as uuidv4} from 'uuid'

const App = () => {
  const uuid = uuidv4();

  return (
    <>
      {/* <Lobby /> */}
      <Login uuid={uuid}/>
      <Game />
    </>
  );
}

export default App;
