export type Player = {
  player_id: string;
  name: string;
  team: string | null;
  position: string | null;
};

export type Roster = {
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

export type TeamSlot =
  | ""
  | "QB"
  | "RB1"
  | "RB2"
  | "WR1"
  | "WR2"
  | "TE"
  | "FLEX"
  | "K"
  | "DEF";