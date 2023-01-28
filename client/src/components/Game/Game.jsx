import { useEffect, useState } from "react";
const io = require('socket.io-client')

export default function Game() {
    const [socket, setSocket] = useState(null);
    const [socketConnected, setSocketConnected] = useState(false);
   
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
      socket.on('barUpdate', (data) => {
        console.log(data)
      });
   
    }, [socket]);
}