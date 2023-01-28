import "./Player.css"

export default function Player({ name, uuid }) {
    return (
        <div className="player-container">
            <div className="player"></div>
            <h4>{name}: {uuid}</h4>
        </div>
    );
}