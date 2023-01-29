import "./Player.css";

export default function Player({ name }) {
    return (
        <div className="player-container">
            <div className="player"></div>
            <h4>{name}</h4>
        </div>
    );
}
