from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv

load_dotenv()

jerrygm_api_key = os.getenv("JERRYGM_API_KEY")

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
def get_players(player_id: str = "", name: str = "", position: str = "", team: str = "", scoring: str = "ppr"):
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

    nfl_response = requests.get(
        "https://api.sleeper.app/v1/state/nfl",
        timeout=15,
    )

    nfl_response.raise_for_status()

    current_week = nfl_response.json().get("week")

    matched_players = []

    for sleeper_player_id, player in players_cache.items():
        first_name = player.get("first_name") or ""
        last_name = player.get("last_name") or ""
        full_name = f"{first_name} {last_name}".strip()

        if player_id != "":
            player_check = sleeper_player_id == player_id
        else:
            player_check = name.lower() in full_name.lower()
        
        
        position_check = (
            position == ""
            or player.get("position") == position
        )

        team_check = (
            team == ""
            or player.get("team") == team
        )

        
        if player_check and position_check and team_check:

            matched_players.append({
                "player_id": sleeper_player_id,
                "name": full_name,
                "position": player.get("position"),
                "team": player.get("team")
                })

            if len(matched_players) >= 20:
                break

    print("Matched sleeper players:", matched_players)

    matched_player_names = []

    for matched_player in matched_players:
        matched_player_names.append(matched_player["name"])

    jerry_response = requests.get(
        "https://api.jerrygm.com/api/ext/v1/projections",
        headers={
            "x-api-key": jerrygm_api_key
        },
        params={
            "horizon": "week",
            "week": current_week,
            "scoring": scoring,
            "names": matched_player_names,
        },
        timeout=15
    )

    print("JerryGM status:", jerry_response.status_code)

    jerry_response.raise_for_status()

    jerry_players = jerry_response.json().get("players")

    print("Jerry players:", jerry_players)

    results = []

    for matched_player in matched_players:
        for jerry_player in jerry_players:
            if jerry_player.get("ids").get("sleeper") == matched_player["player_id"]:
                projected_points = jerry_player.get("projectedPPG")

                results.append({
                    "player_id": matched_player["player_id"],
                    "name": matched_player["name"],
                    "team": matched_player["team"],
                    "position": matched_player["position"],
                    "projected_points": projected_points,
                })

                break

    return results
