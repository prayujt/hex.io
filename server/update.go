package main

type Hexagon struct {
	HexId       int
	TileState   string
	Owner       string
	Count       int
	Production  int
	MaxCapacity int
	AttackCount int
}

var GameState []Hexagon

func gameUpdate() {
	for idx, hex := range GameState {
		if hex.Count < hex.MaxCapacity {
			hex.Count += hex.Production
		}
		GameState[idx] = hex
	}
	server.BroadcastToNamespace("", "gameUpdate", GameState)
}
