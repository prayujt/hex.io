import './ReadyButton.css'

export default function ReadyButton({ handleClick, isReady }) {
    return isReady ? <button id='ready-button'>Ready!</button> 
                   : <button onClick={handleClick} id='not-ready'>Ready?</button>

}