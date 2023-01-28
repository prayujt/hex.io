import React from 'react';
import Lobby from './components/Lobby/Lobby';
import socket from './features/api'
import { useEffect } from 'react';
import Login from './components/Lobby/Login';
import Game from './components/Game/Game';

const App = () => {


  return (
    <>
      <Lobby />
      {/* <Login/> */}
      <Game />
    </>
  );
}

export default App;
