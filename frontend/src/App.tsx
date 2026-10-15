import { useEffect, useState } from "react";
import PLayerCard from "./components/PlayerCard";
import "./App.css";
import type { Player, Roster, TeamSlot } from "./types/fantasy";
import TeamRoster from "./components/TeamRoster";

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const [hasSearched, sethasSearched] = useState(false);
  const [selectedPosition, setselectedPosition] = useState("");
  const [selectedTeam, setselectedTeam] = useState("");
  const [scoring, setScoring] = useState(
    () => localStorage.getItem("fantasyScoring") ?? "ppr",
  );

  const [team, setTeam] = useState<Roster>(() => {
    const savedRoster = localStorage.getItem("fantasyRoster");

    if (savedRoster !== null) {
      return JSON.parse(savedRoster);
    }

    return {
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
    };
  });

  useEffect(() => {
    localStorage.setItem("fantasyRoster", JSON.stringify(team));
  }, [team]);

  useEffect(() => {
    localStorage.setItem("fantasyScoring", scoring);
  }, [scoring]);

  async function refreshRosterProjections(newScoring: string) {
    const allPlayers = [
      team.QB,
      team.RB1,
      team.RB2,
      team.WR1,
      team.WR2,
      team.TE,
      team.FLEX,
      team.K,
      team.DEF,
      ...team.BENCH,
    ];

    const rosterPlayers = allPlayers.filter((player) => player !== null);

    const updatedPlayers: Player[] = [];

    for (const rosterPlayer of rosterPlayers) {
      const response = await fetch(
        `http://127.0.0.1:8000/players?player_id=${rosterPlayer.player_id}&scoring=${newScoring}`,
      );

      const data = await response.json();

      if (data.length > 0) {
        const updatedPlayer = data[0];
        updatedPlayers.push(updatedPlayer);
      }
    }

    function getUpdatedPlayer(player: Player | null) {
      if (player === null) {
        return null;
      }

      const refreshedPlayer = updatedPlayers.find(
        (updatedPlayer) => updatedPlayer.player_id === player.player_id,
      );

      return refreshedPlayer ?? player;
    }

    setTeam((currentTeam) => ({
      ...currentTeam,
      QB: getUpdatedPlayer(currentTeam.QB),
      RB1: getUpdatedPlayer(currentTeam.RB1),
      RB2: getUpdatedPlayer(currentTeam.RB2),
      WR1: getUpdatedPlayer(currentTeam.WR1),
      WR2: getUpdatedPlayer(currentTeam.WR2),
      TE: getUpdatedPlayer(currentTeam.TE),
      FLEX: getUpdatedPlayer(currentTeam.FLEX),
      K: getUpdatedPlayer(currentTeam.K),
      DEF: getUpdatedPlayer(currentTeam.DEF),
      BENCH: currentTeam.BENCH.map(
        (benchPlayer) => getUpdatedPlayer(benchPlayer) ?? benchPlayer,
      ),
    }));
  }

  function searchPlayers(newScoring: string) {
    setisLoading(true);
    sethasSearched(true);

    fetch(
      `http://127.0.0.1:8000/players?name=${encodeURIComponent(searchTerm)}&position=${encodeURIComponent(selectedPosition)}&team=${encodeURIComponent(selectedTeam)}&scoring=${encodeURIComponent(newScoring)}`,
    )
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

  function addPlayerToTeam(player: Player) {
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
        (teamPlayer) => teamPlayer?.player_id === player.player_id,
      );

      if (playerAlreadyAdded) {
        return currentTeam;
      }

      if (player.position === "QB" && currentTeam.QB === null) {
        return {
          ...currentTeam,
          QB: player,
        };
      }

      if (player.position === "RB") {
        if (currentTeam.RB1 === null) {
          return {
            ...currentTeam,
            RB1: player,
          };
        }

        if (currentTeam.RB2 === null) {
          return {
            ...currentTeam,
            RB2: player,
          };
        }
      }

      if (player.position === "WR") {
        if (currentTeam.WR1 === null) {
          return {
            ...currentTeam,
            WR1: player,
          };
        }
        if (currentTeam.WR2 === null) {
          return {
            ...currentTeam,
            WR2: player,
          };
        }
      }

      if (player.position === "TE" && currentTeam.TE === null) {
        return {
          ...currentTeam,
          TE: player,
        };
      }

      if (
        currentTeam.FLEX === null &&
        ["RB", "WR", "TE"].includes(player.position ?? "")
      ) {
        return {
          ...currentTeam,
          FLEX: player,
        };
      }

      if (player.position === "K" && currentTeam.K === null) {
        return {
          ...currentTeam,
          K: player,
        };
      }

      if (player.position === "DEF" && currentTeam.DEF === null) {
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

  function removePlayerFromTeam(player: Player) {
    setTeam((currentTeam) => {
      if (currentTeam.QB?.player_id === player.player_id) {
        return {
          ...currentTeam,
          QB: null,
        };
      }

      if (currentTeam.RB1?.player_id === player.player_id) {
        return {
          ...currentTeam,
          RB1: null,
        };
      }

      if (currentTeam.RB2?.player_id === player.player_id) {
        return {
          ...currentTeam,
          RB2: null,
        };
      }

      if (currentTeam.WR1?.player_id === player.player_id) {
        return {
          ...currentTeam,
          WR1: null,
        };
      }

      if (currentTeam.WR2?.player_id === player.player_id) {
        return {
          ...currentTeam,
          WR2: null,
        };
      }

      if (currentTeam.TE?.player_id === player.player_id) {
        return {
          ...currentTeam,
          TE: null,
        };
      }

      if (currentTeam.FLEX?.player_id === player.player_id) {
        return {
          ...currentTeam,
          FLEX: null,
        };
      }

      if (currentTeam.K?.player_id === player.player_id) {
        return {
          ...currentTeam,
          K: null,
        };
      }

      if (currentTeam.DEF?.player_id === player.player_id) {
        return {
          ...currentTeam,
          DEF: null,
        };
      }

      return {
        ...currentTeam,
        BENCH: currentTeam.BENCH.filter(
          (benchPlayer) => benchPlayer.player_id !== player.player_id,
        ),
      };
    });
  }

  function movePlayerOnTeam(player: Player) {
    setTeam((currentTeam) => {
      if (currentTeam.QB?.player_id === player.player_id) {
        return {
          ...currentTeam,
          QB: null,
          BENCH: [...currentTeam.BENCH, player],
        };
      }

      if (currentTeam.RB1?.player_id === player.player_id) {
        return {
          ...currentTeam,
          RB1: null,
          BENCH: [...currentTeam.BENCH, player],
        };
      }

      if (currentTeam.RB2?.player_id === player.player_id) {
        return {
          ...currentTeam,
          RB2: null,
          BENCH: [...currentTeam.BENCH, player],
        };
      }

      if (currentTeam.WR1?.player_id === player.player_id) {
        return {
          ...currentTeam,
          WR1: null,
          BENCH: [...currentTeam.BENCH, player],
        };
      }

      if (currentTeam.WR2?.player_id === player.player_id) {
        return {
          ...currentTeam,
          WR2: null,
          BENCH: [...currentTeam.BENCH, player],
        };
      }

      if (currentTeam.TE?.player_id === player.player_id) {
        return {
          ...currentTeam,
          TE: null,
          BENCH: [...currentTeam.BENCH, player],
        };
      }

      if (currentTeam.FLEX?.player_id === player.player_id) {
        return {
          ...currentTeam,
          FLEX: null,
          BENCH: [...currentTeam.BENCH, player],
        };
      }

      if (currentTeam.K?.player_id === player.player_id) {
        return {
          ...currentTeam,
          K: null,
          BENCH: [...currentTeam.BENCH, player],
        };
      }

      if (currentTeam.DEF?.player_id === player.player_id) {
        return {
          ...currentTeam,
          DEF: null,
          BENCH: [...currentTeam.BENCH, player],
        };
      }

      return currentTeam;
    });
  }

  function moveBenchToTeam(player: Player, slot: TeamSlot) {
    setTeam((currentTeam) => {
      const isOnBench = currentTeam.BENCH.some(
        (benchPlayer) => benchPlayer.player_id === player.player_id,
      );
      if (!isOnBench) {
        return currentTeam;
      }

      if (slot === "QB") {
        if (currentTeam.QB === null && player.position === "QB") {
          return {
            ...currentTeam,
            QB: player,
            BENCH: currentTeam.BENCH.filter(
              (benchPlayer) => benchPlayer.player_id !== player.player_id,
            ),
          };
        }
      }

      if (slot === "RB1") {
        if (currentTeam.RB1 === null && player.position === "RB") {
          return {
            ...currentTeam,
            RB1: player,
            BENCH: currentTeam.BENCH.filter(
              (benchPlayer) => benchPlayer.player_id !== player.player_id,
            ),
          };
        }
      }

      if (slot === "RB2") {
        if (currentTeam.RB2 === null && player.position === "RB") {
          return {
            ...currentTeam,
            RB2: player,
            BENCH: currentTeam.BENCH.filter(
              (benchPlayer) => benchPlayer.player_id !== player.player_id,
            ),
          };
        }
      }

      if (slot === "WR1") {
        if (currentTeam.WR1 === null && player.position === "WR") {
          return {
            ...currentTeam,
            WR1: player,
            BENCH: currentTeam.BENCH.filter(
              (benchPlayer) => benchPlayer.player_id !== player.player_id,
            ),
          };
        }
      }

      if (slot === "WR2") {
        if (currentTeam.WR2 === null && player.position === "WR") {
          return {
            ...currentTeam,
            WR2: player,
            BENCH: currentTeam.BENCH.filter(
              (benchPlayer) => benchPlayer.player_id !== player.player_id,
            ),
          };
        }
      }

      if (slot === "TE") {
        if (currentTeam.TE === null && player.position === "TE") {
          return {
            ...currentTeam,
            TE: player,
            BENCH: currentTeam.BENCH.filter(
              (benchPlayer) => benchPlayer.player_id !== player.player_id,
            ),
          };
        }
      }

      if (slot === "FLEX") {
        if (
          currentTeam.FLEX === null &&
          ["RB", "WR", "TE"].includes(player.position ?? "")
        ) {
          return {
            ...currentTeam,
            FLEX: player,
            BENCH: currentTeam.BENCH.filter(
              (benchPlayer) => benchPlayer.player_id !== player.player_id,
            ),
          };
        }
      }

      if (slot === "K") {
        if (currentTeam.K === null && player.position === "K") {
          return {
            ...currentTeam,
            K: player,
            BENCH: currentTeam.BENCH.filter(
              (benchPlayer) => benchPlayer.player_id !== player.player_id,
            ),
          };
        }
      }

      if (slot === "DEF") {
        if (currentTeam.DEF === null && player.position === "DEF") {
          return {
            ...currentTeam,
            DEF: player,
            BENCH: currentTeam.BENCH.filter(
              (benchPlayer) => benchPlayer.player_id !== player.player_id,
            ),
          };
        }
      }

      return currentTeam;
    });
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>AI Fantasy Coach</h1>
      <p>This is the AI powered coach for Fantasy</p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          searchPlayers(scoring);
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
          value={scoring}
          onChange={(event) => {
            setScoring(event.target.value);
            refreshRosterProjections(event.target.value);
            searchPlayers(event.target.value);
          }}
        >
          <option value="ppr">PPR</option>
          <option value="half">Half-PPR</option>
          <option value="standard">Standard</option>
        </select>

        <select
          value={selectedTeam}
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
        {hasSearched && !isLoading && players.length === 0 && !errorMessage && (
          <p>No Players found</p>
        )}
        <div className="player-grid">
          {players.map((player) => (
            <PLayerCard
              key={player.player_id}
              player={player}
              addToTeam={addPlayerToTeam}
            />
          ))}
        </div>
      </div>
      <TeamRoster
        team={team}
        removePlayer={removePlayerFromTeam}
        moveToBench={movePlayerOnTeam}
        moveBenchToTeam={moveBenchToTeam}
      />
    </main>
  );
}

export default App;
