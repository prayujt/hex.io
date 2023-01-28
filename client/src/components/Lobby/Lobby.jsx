import ReadyButton from './ReadyButton'
import Players from './Players'
import './Lobby.css'
import { useEffect, useState } from 'react';
import { fetchUsers } from '../../features/api';

export default function Lobby() {
    const [players, setPlayers] = useState([])
    
    useEffect(()=> {
        const getUsers = async () => {
            const users = await fetchUsers()
            setPlayers(users)
        }

        getUsers()

        

    }, [])
    
    return (
        <>
            <div className='lobby-container'>
                <h1>Welcome to Hex.io!</h1>

                <h2>Players:</h2>
                {players.map((player)=> (
                    <Players name={player} />
                ))}
                <ReadyButton id='button' />

            </div>
        </>
    );
}
