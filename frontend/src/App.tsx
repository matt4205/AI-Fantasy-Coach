import { useState } from "react";

function App() {
  const [players, setPlayers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");


  function searchPlayers(){
    fetch(`http://127.0.0.1:8000/players?name=${encodeURIComponent(searchTerm)}`)
    .then((res) => res.json())
    .then((data) => setPlayers(data))
    .catch((error) => {
      console.error("API error:", error);
    });
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>AI Fantasy Coach</h1>
      <p>This is the AI powered coach for Fantasy</p>

      <div>
        <h2>Search Player</h2>

        <input 
          value = {searchTerm}
          placeholder="Type here"
          onChange={(event) => {
            setSearchTerm(event.target.value)
          }}
        />
        <button onClick={searchPlayers}>Search</button>
      </div>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h3>Players</h3>

        {players.map((player) => (
          <div key={player.name}>
            <p>Name: {player.name}</p>
            <p>Team: {player.team}</p>
            <p>Position: {player.position}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
