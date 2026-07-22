from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()
players_cache = None

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AI Fantasy Coach API is running"}

@app.get("/health")
def health_check():
    return{"status": "Healthy"}

@app.get("/players")
def get_players(name: str, position: str = "", team: str = ""):
    global players_cache

    if players_cache is None:
         print("getting players from sleeper")

         response = requests.get(
             "https://api.sleeper.app/v1/players/nfl",
               timeout=15,
        )

         print("Sleeper status:", response.status_code)
         
         response.raise_for_status()
         players_cache = response.json()

    results = []

    for player_id, player in players_cache.items():
        first_name = player.get("first_name") or ""
        last_name = player.get("last_name") or ""
        full_name = f"{first_name} {last_name}".strip()

        name_check = name.lower() in full_name.lower()

        position_check = (
            position == ""
            or player.get("position") == position
        )

        team_check = (
            team == ""
            or player.get("team") == team
        )
        
        if name_check and position_check and team_check:
            results.append({
                "player_id": player_id,
                "name": full_name,
                "team": player.get("team"),
                "position": player.get("position"),
            })

            if len(results) >= 20:
                break

    return results