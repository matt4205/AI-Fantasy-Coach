import type {Player, Roster, TeamSlot} from "../types/fantasy";
import RosterSlot from "./RosterSlot";
import BenchPlayer from "./BenchPlayer";

type TeamRosterProps = {
    team: Roster;
    removePlayer: (player: Player) => void;
    moveToBench: (player: Player) => void;
    moveBenchToTeam: (player: Player, slot: TeamSlot) => void;
};

function TeamRoster({
    team,
    removePlayer,
    moveToBench,
    moveBenchToTeam,
}: TeamRosterProps) {
    return (
        <section>
            <h2>My Team</h2>

            <RosterSlot slot="QB" player={team.QB} removePlayer={removePlayer} moveToBench={moveToBench}/>

            <RosterSlot slot="RB1" player={team.RB1} removePlayer={removePlayer} moveToBench={moveToBench}/>

            <RosterSlot slot="RB2" player={team.RB2} removePlayer={removePlayer} moveToBench={moveToBench}/>

            <RosterSlot slot="WR1" player={team.WR1} removePlayer={removePlayer} moveToBench={moveToBench}/>

            <RosterSlot slot="WR2" player={team.WR2} removePlayer={removePlayer} moveToBench={moveToBench}/>

            <RosterSlot slot="TE" player={team.TE} removePlayer={removePlayer} moveToBench={moveToBench}/>

            <RosterSlot slot="FLEX" player={team.FLEX} removePlayer={removePlayer} moveToBench={moveToBench}/>

            <RosterSlot slot="K" player={team.K} removePlayer={removePlayer} moveToBench={moveToBench}/>

            <RosterSlot slot="DEF" player={team.DEF} removePlayer={removePlayer} moveToBench={moveToBench}/>

            <div>
            <h3>Bench</h3>

            {team.BENCH.length === 0 && <p>Bench is empty</p>}

            {team.BENCH.map((player) => (
                <BenchPlayer key={player.player_id} player={player} removePlayer={removePlayer} moveBenchToTeam={moveBenchToTeam}/>
            ))}
            </div>
        </section>
    );
}

export default TeamRoster;