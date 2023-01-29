package main

import (
	"log"
	// "math"
)

type Hexagon struct {
	HexId       int
	TileState   string
	Owner       string
	Count       float64
	Production  float64
	MaxCapacity float64
	AttackCount int
	Color       string
}

type Balance struct {
	Uuid       string
	Percentage float64
}

var GameState []Hexagon

func gameUpdate() {
	for idx, hex := range GameState {
		if hex.Count < hex.MaxCapacity {
			hex.Count += float64(hex.Production) / float64(UpdatesPerSecond)
		}
		GameState[idx] = hex
	}

	server.BroadcastToNamespace("", "gameUpdate", GameState)
}

func barUpdate() {
	var PowerBalance []Balance
	balanceMap := make(map[string]float64)

	total := 0.0
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
			Percentage: float64(count) * 100 / float64(total),
		})
	}

	server.BroadcastToNamespace("", "barUpdate", PowerBalance)
}

func trackMovements() {
	for idx, movement := range Moves {
		timeRemaining := movement.Time
		movement.Time -= 1
		if timeRemaining == 0 {
			if len(Moves) == 1 {
				var Temp []HexMove
				Moves = Temp
			} else {
				Moves = append(Moves[:idx], Moves[idx+1:]...)
			}
			log.Printf("Finished movement for %f", movement.Count)
		} else {
			Moves[idx] = movement
		}
	}
}
