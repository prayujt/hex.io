const io = require("socket.io-client");


//Http routes for lobby
export const fetchUsers = async () => {
    let res = await fetch('http://' + process.env.REACT_APP_API_URL + '/names');
    
    return await res.json()
}

export const postUser = (newPlayer) => {
    fetch('http://' + process.env.REACT_APP_API_URL + '/updateName', {
        method: "POST",
        body: JSON.stringify(newPlayer)
    })
         
}

export const postUserReady = (newPlayer) => {
    fetch('http://' + process.env.REACT_APP_API_URL + '/updateName', {
        method: "POST",
        body: JSON.stringify(newPlayer)
    })
         
}


//Sockets for game
export const socket = io("ws://" + process.env.REACT_APP_API_URL + "/socket.io");





