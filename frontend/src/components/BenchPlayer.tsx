import { useState } from "react";
import type { Player, TeamSlot } from "../types/fantasy";

type BenchPlayerProps = {
    player: Player;
    removePlayer: (player: Player) => void;
    moveBenchToTeam: (player: Player, slot: TeamSlot) => void;
};

function BenchPlayer({
    player,
    removePlayer,
    moveBenchToTeam,
}: BenchPlayerProps) {
    const [selectedSlot, setSelectedSlot] = useState<TeamSlot>("");

    return (
        <div>
            <span>
                {player.name} = {player.position ?? "No position"} -{" "}
                {player.team ?? "No team"}
            </span>

            <button type="button" onClick={() => removePlayer(player)}>Remove</button>
            <select value={selectedSlot} onChange={(event) => {setSelectedSlot(event.target.value as TeamSlot);}}>
                <option value="">Choose a position</option>
                <option value="QB">QB</option>
                <option value="RB1">RB1</option>
                <option value="RB2">RB2</option>
                <option value="WR1">WR1</option>
                <option value="WR2">WR2</option>
                <option value="TE">TE</option>
                <option value="FLEX">FLEX</option>
                <option value="K">K</option>
                <option value="DEF">DEF</option>
            </select>

            <button type="button" disabled={selectedSlot === ""} onClick={() => moveBenchToTeam(player,selectedSlot)}>Move to Team</button>
        </div>
    );
}

export default BenchPlayer;