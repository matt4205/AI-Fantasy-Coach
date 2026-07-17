from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

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
def get_players(name: str):
    response = requests.get("https://api.sleeper.app/v1/players/nfl", timeout=15,)

    response.raise_for_status()

    players = response.json()
    results = []

    for player_id, player in players.items():
        first_name = player.get("first_name") or ""
        last_name = player.get("last_name") or ""
        full_name = f"{first_name} {last_name}".strip()

        if name.lower() in full_name.lower():
            results.append({
                "player_id": player_id,
                "name": full_name,
                "team": player.get("team"),
                "position": player.get("position"),
            })

        if len(results) >= 20:
            break

    return results