import { io } from "socket.io-client";


//Http routes for lobby
export const fetchUsers = async () => {
    const res = await fetch('http://' + process.env.REACT_APP_API_URL + '/names');
            return await res.json()
}

//Sockets for game
const socket = io("ws://" + process.env.REACT_APP_API_URL + "/socket.io");




