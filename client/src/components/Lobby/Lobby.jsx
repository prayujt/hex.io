import ReadyButton from './ReadyButton'
import Player from './Player'
import './Lobby.css'
import { useEffect, useState } from 'react';
import { fetchUsers, postUserReady } from '../../features/api';
import Game from '../Game/Game';

export default function Lobby({ uuid }) {
    const [players, setPlayers] = useState([]);
    const [isPlayerReady, setisPlayerReady] = useState(false)

    const getUsers = async () => {
        const users = await fetchUsers()
        users === null ? setPlayers([]) : setPlayers(users.sort())
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            getUsers()
        }, 250);
        return () => clearTimeout(timer);
    })

    const handleButtonOnClick = (e) => {
        e.preventDefault();
        const playerStatus = {
            uuid: uuid,
        }
        postUserReady(playerStatus)
        setisPlayerReady(true)
    }


    return (
        <>
            <div className='lobby-container'>
                <h1>Welcome to Hex.io!</h1>
                <h2>{uuid}</h2>

                <h2>Players:</h2>
                {players.map((player) => (
                    <Player name={player} />
                ))}
                <ReadyButton handleClick={handleButtonOnClick} isReady={isPlayerReady} />

            </div>
        </>
    );

}
