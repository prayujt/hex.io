import './ReadyButton.css'

export default function ReadyButton({ handleClick }) {
    return (
        <button onClick={handleClick} id='ready-button'>Ready</button>
    );
}