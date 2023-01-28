import ReadyButton from './ReadyButton'
import Player from './Player'
import './Lobby.css'
import { useEffect, useState } from 'react';
import { fetchUsers } from '../../features/api';

export default function Lobby() {
    const [players, setPlayers] = useState([])

    const getUsers = async () => {
        const users = await fetchUsers()
        setPlayers(users)
    }

    useEffect(()=> {
        const timer = setTimeout(() => {
            getUsers()
        }, 1000);
        return () => clearTimeout(timer);
    })


   

    return (
        <>
            <div className='lobby-container'>
                <h1>Welcome to Hex.io!</h1>

                <h2>Players:</h2>
                {players.map((player) => (
                    <Player name={player} />
                ))}
                <ReadyButton />

            </div>
        </>
    );
}
