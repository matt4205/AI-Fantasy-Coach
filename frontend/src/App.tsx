import { useState } from "react";
import PLayerCard from "./components/PlayerCard";
import "./App.css"

type Player = {
  player_id: string;
  name: string;
  team: string | null;
  position: string | null;
};

type Roster = {
  QB: Player | null;
  RB1: Player | null;
  RB2: Player | null;
  WR1: Player | null;
  WR2: Player | null;
  TE: Player | null;
  FLEX: Player | null;
  K: Player | null;
  DEF: Player | null;
  BENCH: Player[];
};

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const [hasSearched, sethasSearched] = useState(false);
  const [selectedPosition, setselectedPosition] = useState("");
  const [selectedTeam, setselectedTeam] = useState("");
  const [team, setTeam] = useState<Roster>({
    QB: null,
    RB1: null,
    RB2: null,
    WR1: null,
    WR2: null,
    TE: null,
    FLEX: null,
    K: null,
    DEF: null,
    BENCH: [],
});

  function searchPlayers(){
    setisLoading(true);
    sethasSearched(true);

    fetch(`http://127.0.0.1:8000/players?name=${encodeURIComponent(searchTerm)}&position=${encodeURIComponent(selectedPosition)}&team=${encodeURIComponent(selectedTeam)}`)

    .then((res) => {
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      return res.json();
    })
    
    .then((data: Player[]) => {
      setPlayers(data);
    })
    
    .catch((error) => {
      console.error("API error:", error);
      setPlayers([]);
      seterrorMessage("Couldn't search for players");
    })
    .finally(() => {
      setisLoading(false);
    });
  }

  function addPlayerToTeam(player: Player){
    setTeam((currentTeam) => {
      const allPlayers = [
        currentTeam.QB,
        currentTeam.RB1,
        currentTeam.RB2,
        currentTeam.WR1,
        currentTeam.WR2,
        currentTeam.TE,
        currentTeam.FLEX,
        currentTeam.K,
        currentTeam.DEF,
        ...currentTeam.BENCH,
      ];

      const playerAlreadyAdded = allPlayers.some(
        (teamPlayer) => teamPlayer?.player_id === player.player_id
      );

      if (playerAlreadyAdded) {
        return currentTeam;
      }

      if (player.position === "QB" && currentTeam.QB === null){
        return {
          ...currentTeam,
          QB: player,
        };
      }

      if (player.position === "RB"){
        if (currentTeam.RB1 === null){
          return{
            ...currentTeam,
            RB1: player,
          };
        }

        if (currentTeam.RB2 === null){
          return {
            ...currentTeam,
            RB2: player,
          };
        }
      }

      if (player.position === "WR"){
        if (currentTeam.WR1 === null){
          return{
            ...currentTeam,
            WR1: player,
          };
        }
        if (currentTeam.WR2 === null){
          return {
            ...currentTeam,
            WR2: player,
          };
        }
      }

      if (player.position === "TE" && currentTeam.TE === null){
        return {
          ...currentTeam,
          TE: player,
        };
      }

      if (currentTeam.FLEX === null && ["RB", "WR", "TE"].includes(player.position ?? "")){
        return {
          ...currentTeam,
          FLEX: player,
        };
      }

      if (player.position === "K" && currentTeam.K === null){
        return {
          ...currentTeam,
          K: player,
        };
      }

      if (player.position === "DEF" && currentTeam.DEF === null){
        return {
          ...currentTeam,
          DEF: player,
        };
      }

      return {
        ...currentTeam,
        BENCH: [...currentTeam.BENCH, player],
      };
    });
  }

  function removePlayerFromTeam(player: Player){
    setTeam((currentTeam) => {
      if (currentTeam.QB?.player_id === player.player_id){
        return {
          ...currentTeam,
          QB: null
        };
      }

      if (currentTeam.RB1?.player_id === player.player_id){
        return {
          ...currentTeam,
          RB1: null
        };
      }

      if (currentTeam.RB2?.player_id === player.player_id){
        return {
          ...currentTeam,
          RB2: null
        };
      }

      if (currentTeam.WR1?.player_id === player.player_id){
        return {
          ...currentTeam,
          WR1: null
        };
      }

      if (currentTeam.WR2?.player_id === player.player_id){
        return {
          ...currentTeam,
          WR2: null
        };
      }

      if (currentTeam.TE?.player_id === player.player_id){
        return {
          ...currentTeam,
          TE: null
        };
      }

      if (currentTeam.FLEX?.player_id === player.player_id){
        return {
          ...currentTeam,
          FLEX: null
        };
      }

      if (currentTeam.K?.player_id === player.player_id){
        return {
          ...currentTeam,
          K: null
        };
      }

      if (currentTeam.DEF?.player_id === player.player_id){
        return {
          ...currentTeam,
          DEF: null
        };
      }

      return {
        ...currentTeam,
        BENCH: currentTeam.BENCH.filter((benchPlayer) => benchPlayer.player_id !== player.player_id)};
    });
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>AI Fantasy Coach</h1>
      <p>This is the AI powered coach for Fantasy</p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          searchPlayers();
        }}
        >
          <h2>Search Player</h2>
          <input
            value={searchTerm}
            placeholder="Type here"
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
          />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>

        <select
          value={selectedPosition}
          onChange={(event) => {
            setselectedPosition(event.target.value);
          }}
        >
          <option value="">All</option>
          <option value="QB">QB</option>
          <option value="RB">RB</option>
          <option value="WR">WR</option>
          <option value="TE">TE</option>
          <option value="K">K</option>
          <option value="DEF">DEF</option>
        </select>

        <select
          value = {selectedTeam}
          onChange={(event) => {
            setselectedTeam(event.target.value);
          }}
        >
          <option value="">All</option>
          <option value="ARI">ARI</option>
          <option value="ATL">ATL</option>
          <option value="BAL">BAL</option>
          <option value="BUF">BUF</option>
          <option value="CAR">CAR</option>
          <option value="CHI">CHI</option>
          <option value="CIN">CIN</option>
          <option value="CLE">CLE</option>
          <option value="DAL">DAL</option>
          <option value="DEN">DEN</option>
          <option value="DET">DET</option>
          <option value="GB">GB</option>
          <option value="HOU">HOU</option>
          <option value="IND">IND</option>
          <option value="JAX">JAX</option>
          <option value="KC">KC</option>
          <option value="LV">LV</option>
          <option value="LAC">LAC</option>
          <option value="LAR">LAR</option>
          <option value="MIA">MIA</option>
          <option value="MIN">MIN</option>
          <option value="NE">NE</option>
          <option value="NO">NO</option>
          <option value="NYG">NYG</option>
          <option value="NYJ">NYJ</option>
          <option value="PHI">PHI</option>
          <option value="PIT">PIT</option>
          <option value="SF">SF</option>
          <option value="SEA">SEA</option>
          <option value="TB">TB</option>
          <option value="TEN">TEN</option>
          <option value="WAS">WAS</option>
        </select>
      </form>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h3>Players</h3>
        {hasSearched && !isLoading && players.length === 0 && !errorMessage &&(
          <p>No Players found</p>
        )}
        <div className="player-grid">
          {players.map((player) => (
            <PLayerCard
              key={player.player_id}
              player = {player}
              addToTeam={addPlayerToTeam}
            />
        ))}
        </div>
      </div>

      <section>
        <h2>My Team</h2>

        <div>
          <h3>QB</h3>

          {team.QB ? (
            <div>
              <p>
                {team.QB.name} - {team.QB.team ?? "No team"}
              </p>

              <button type="button" onClick={() => removePlayerFromTeam(team.QB!)}>Remove</button>
            </div>
          ):(
            <p>Empty</p>
          )}
        </div>

        <div>
          <h3>RB1</h3>

          {team.RB1 ? (
            <div>
              <p> 
                {team.RB1.name} - {team.RB1.team ?? "No team"}
              </p>

              <button type="button" onClick={() => removePlayerFromTeam(team.RB1!)}>Remove</button>
            </div>
          ) : (
            <p>Empty</p>
          )}
        </div>

        <div>
          <h3>RB2</h3>

          {team.RB2 ? (
            <div>
              <p>
                {team.RB2.name} - {team.RB2.team ?? "No team"}
              </p>

              <button type="button" onClick={() => removePlayerFromTeam(team.RB2!)}>Remove</button>
            </div>
          ) : (
            <p>Empty</p>
          )}
        </div>

        <div>
          <h3>WR1</h3>

          {team.WR1 ? (
            <div>
              <p>
                {team.WR1.name} - {team.WR1.team ?? "No team"}
              </p>

              <button type="button" onClick={() => removePlayerFromTeam(team.WR1!)}>Remove</button>
            </div>
          ) : (
            <p>Empty</p>
          )}
        </div>

        <div>
          <h3>WR2</h3>

          {team.WR2 ? (
            <div>
              <p>
                {team.WR2.name} - {team.WR2.team ?? "No team"}
              </p>

              <button type="button" onClick={() => removePlayerFromTeam(team.WR2!)}>Remove</button>
            </div>
          ) : (
            <p>Empty</p>
          )}
        </div>

        <div>
          <h3>TE</h3>

          {team.TE ? (
            <div>
              <p>
                {team.TE.name} - {team.TE.team ?? "No team"}
              </p>

              <button type="button" onClick={() => removePlayerFromTeam(team.TE!)}>Remove</button>
            </div>
          ) : (
            <p>Empty</p>
          )}
        </div>

        <div>
          <h3>FLEX</h3>

          {team.FLEX ? (
            <div>
              <p>
                {team.FLEX.name} - {team.FLEX.position ?? "No position"} - {team.FLEX.team ?? "No Team"}
              </p>

              <button type="button" onClick={() => removePlayerFromTeam(team.FLEX!)}>Remove</button>
            </div>
          ) :(
            <p>Empty</p>
          )}
        </div>

        <div>
          <h3>K</h3>

          {team.K ? (
            <div>
              <p>
                {team.K.name} - {team.K.team ?? "No team"}
              </p>

              <button type="button" onClick={() => removePlayerFromTeam(team.K!)}>Remove</button>
            </div>
          ) : (
            <p>Empty</p>
          )}
        </div>

        <div>
          <h3>DEF</h3>

          {team.DEF ? (
            <div>
              <p>
                {team.DEF.name} - ({team.DEF.team})
              </p>

              <button type="button" onClick={() => removePlayerFromTeam(team.DEF!)}>Remove</button>
            </div>
          ) : (
            <p>Empty</p>
          )}
        </div>

        <div>
          <h3>BENCH</h3>

          {team.BENCH.length === 0 && <p>Bench is empty</p>}

          {team.BENCH.map((player) => (
            <div key ={player.player_id}>
            <span>
              {player.name} - {player.position ?? "No positon"} - {" "} {player.team ?? "No team"}
            </span>
            
            <button type="button" onClick={() => removePlayerFromTeam(player)}>Remove</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
