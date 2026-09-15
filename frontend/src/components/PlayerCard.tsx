import type { Player } from "../types/fantasy";

type PlayerCardProp = {
    player: Player;
    addToTeam: (player: Player) => void;
};

function PlayerCard({player, addToTeam}: PlayerCardProp){
    return (
        <article className="player-card">
            <div className="player-card_head">
                <div>
                    <h3>{player.name}</h3>
                    <p>
                        {player.position ?? "no position"} |{" "} {player.team ?? "No current team"}
                    </p>
                    <p>
                        Projected: {player.projected_points} pts
                    </p>
                </div>
            </div>
            <button 
                className="player-card-button"
                onClick ={() => addToTeam(player)}
            >
                Add to Team
            </button>
        </article>
    );
}

export default PlayerCard;