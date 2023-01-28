import React from 'react';
import Lobby from './components/Lobby/Lobby';
import socket from './features/api'
import { useEffect } from 'react';
import Login from './components/Lobby/Login';

const App = () => {


  return (
    <>
      <Lobby />
      {/* <Login/> */}
    </>
  );
}

export default App;
