import { useEffect, useState } from "react";
import Board from "./Board";
// import Names from "./Names";

import { Skeleton } from "@mui/material";
import "./Game.css";
const io = require("socket.io-client");

const Game = ({ username, gameState }) => {
    const [socket, setSocket] = useState(null);
    const [socketConnected, setSocketConnected] = useState(false);
    useEffect(() => {
        setSocket(io("http://" + process.env.REACT_APP_API_URL));
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("connect", () => {
            setSocketConnected(socket.connected);
            console.log("Connected");
        });
        socket.on("disconnect", () => {
            setSocketConnected(socket.connected);
        });
    }, [socket]);

    if (socketConnected) {
        return (
            <div>
                <Board
                    socket={socket}
                    username={username}
                    initialData={gameState}
                />
                {/* <Names /> */}
            </div>
        );
    } else
        return (
            <Skeleton
                sx={{ bgcolor: "grey.900" }}
                variant="rectangular"
                width={window.innerWidth}
                height={window.innerHeight}
            />
        );
};

export default Game;
