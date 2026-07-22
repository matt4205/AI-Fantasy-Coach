import { useState } from "react";

type Player = {
  player_id: string;
  name: string;
  team: string | null;
  position: string | null;
};

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const [hasSearched, sethasSearched] = useState(false);
  const [selectedPosition, setselectedPosition] = useState("");
  const [selectedTeam, setselectedTeam] = useState("");

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
        {players.map((player) => (
          <div key={player.player_id}>
            <p>Name: {player.name}</p>
            <p>Team: {player.team ?? "No team listed"}</p>
            <p>Position: {player.position ?? "No position listed"}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
