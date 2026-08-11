import type { Player, TeamSlot} from "../types/fantasy";

type RosterSlotProps = {
    slot: TeamSlot;
    player: Player | null;
    removePlayer: (player: Player) => void;
    moveToBench: (player: Player) => void;
};

function RosterSlot({
    slot,
    player,
    removePlayer,
    moveToBench,
}: RosterSlotProps) {
    return (
        <div>
            <h3>{slot}</h3>

            {player ? (
                <div>
                    <p>
                        {player.name} - {player.position ?? "No position"} -{" "}
                        {player.team ?? "No team"}
                    </p>

                    <button type="button" onClick = {() => removePlayer(player)}>Remove</button>

                    <button type="button" onClick = {() => moveToBench(player)}>Move to Bench</button>
                </div>
            ) : (
                <p>Empty</p>
            )}
        </div>
    );
}

export default RosterSlot;