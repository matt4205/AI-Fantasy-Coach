from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
    players = [
        {
        "name": "Josh Allen",
        "team": "BUF",
        "position": "QB",
    },
    {
        "name": "Bo Nix",
        "team": "DEN",
        "position": "QB",
    },
    {
        "name": "Dak Prescott",
        "team": "DAL",
        "position": "QB",
    },
    {
        "name": "Josh Jacobs",
        "team": "GB",
        "position": "RB",
    }
]

    results = []

    for player in players:
        if name.lower() in player["name"].lower():
            results.append(player)

    return results