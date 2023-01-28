import { useEffect } from "react";
import { socket } from "../../features/api";

export default function Game() {
    useEffect(() => {
        console.log("Yoot")
        socket.on('connect', () => {
            console.log("ping")
        });
        socket.on('gameUpdate', (data) => { 
            console.log(data)
        })  

        return () => {
            socket.off('connect');
            socket.off('gameUpdate');
        };
    });
}