package main

type Hexagon struct {
	HexId       int
	TileState   string
	Owner       string
	Count       int
	Production  int
	MaxCapacity int
	AttackCount int
	Color       string
}

type Balance struct {
	Uuid       string
	Percentage float32
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

func barUpdate() {
	var PowerBalance []Balance
	balanceMap := make(map[string]int)

	total := 0
	for _, hex := range GameState {
		total += hex.Count
		if count, exists := balanceMap[hex.Owner]; exists {
			balanceMap[hex.Owner] = count + hex.Count
		} else {
			balanceMap[hex.Owner] = hex.Count
		}
	}

	for uuid, count := range balanceMap {
		PowerBalance = append(PowerBalance, Balance{
			Uuid:       uuid,
			Percentage: float32(count) * 100 / float32(total),
		})
	}

	server.BroadcastToNamespace("", "barUpdate", PowerBalance)
}
