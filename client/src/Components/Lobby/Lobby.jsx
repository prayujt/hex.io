import ReadyButton from './ReadyButton'
import Players from './Players'
import './Lobby.css'

export default function Lobby() {
    return (
        <>
        <div className='lobby-container'>
            <h1>Welcome to Hex.io!</h1>
            <ReadyButton id='button' />
            <Players />
        </div>
        </>
    );
}