import React from 'react';
import Lobby from './components/Lobby/Lobby';
import socket from './features/api'
import { useEffect } from 'react';

const App = () => {


  return (
    <>
      <Lobby />
    </>
  );
}

export default App;
