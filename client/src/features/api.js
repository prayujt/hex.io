//Http routes for lobby
export const fetchUsers = async () => {
    let res = await fetch("http://" + process.env.REACT_APP_API_URL + "/names");

    return await res.json();
};

export const postUser = (newPlayer) => {
    fetch("http://" + process.env.REACT_APP_API_URL + "/updateName", {
        method: "POST",
        body: JSON.stringify(newPlayer),
    });
};

export const postUserReady = (playerReadyStatus) => {
    fetch("http://" + process.env.REACT_APP_API_URL + "/playerReady", {
        method: "POST",
        body: JSON.stringify(playerReadyStatus),
    });
};

export const postMove = (movement) => {
    fetch("http://" + process.env.REACT_APP_API_URL + "/move", {
        method: "POST",
        body: JSON.stringify(movement),
    });
};
