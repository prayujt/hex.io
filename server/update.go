package main

import (
	"github.com/google/uuid"
	"log"
)

type Hexagon struct {
	HexId       int
	TileState   string
	Owner       string
	Count       float64
	Production  float64
	MaxCapacity float64
	AttackCount float64
	Color       string
}

type Balance struct {
	Uuid       string
	Percentage float64
}

type Battle struct {
	Tile        int
	HomeCount   float64
	AttackCount float64
	Attacker    string
}

var GameState []Hexagon
var Battles = make(map[uuid.UUID]Battle)

func gameUpdate() {
	for idx, hex := range GameState {
		if hex.Count < hex.MaxCapacity && hex.TileState != "contested" {
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
	for uuid_, movement := range Moves {
		timeRemaining := movement.Time
		movement.Time -= 1
		if timeRemaining == 0 {
			delete(Moves, uuid_)
			log.Printf("Finished movement for %f", movement.Count)

			if movement.Sender == GameState[movement.To].Owner {
				GameState[movement.To].Count += movement.Count

			} else {
				existing := false
				for uuid_, battle := range Battles {
					if battle.Tile == movement.To {
						existing = true
						if battle.Attacker == movement.Sender {
							battle.AttackCount += movement.Count
						} else {
							battle.HomeCount += movement.Count
						}

						Battles[uuid_] = battle
					}
				}

				if !existing {
					battle := Battle{
						Tile:        movement.To,
						HomeCount:   GameState[movement.To].Count,
						AttackCount: movement.Count,
						Attacker:    movement.Sender,
					}
					GameState[movement.To].AttackCount = movement.Count
					GameState[movement.To].TileState = "contested"
					GameState[movement.To].Color = "red"

					Battles[uuid.New()] = battle
				}
			}
		} else {
			Moves[uuid_] = movement
		}
	}

	server.BroadcastToNamespace("", "movementUpdate", Moves)
}

func trackBattles() {
	for uuid_, battle := range Battles {
		battle.AttackCount -= 1
		battle.HomeCount -= 1
		GameState[battle.Tile].AttackCount = battle.AttackCount
		GameState[battle.Tile].Count = battle.HomeCount

		if battle.AttackCount <= 0 {
			log.Printf("Battle %s completed, home won!", uuid_)
			GameState[battle.Tile].TileState = "owned"
			GameState[battle.Tile].Color = PlayerColors[GameState[battle.Tile].Owner]
			GameState[battle.Tile].AttackCount = 0
			delete(Battles, uuid_)

		} else if battle.HomeCount <= 0 {
			log.Printf("Battle %s completed, attacker won!", uuid_)

			GameState[battle.Tile].Count = battle.AttackCount
			GameState[battle.Tile].TileState = "owned"
			GameState[battle.Tile].Owner = battle.Attacker
			GameState[battle.Tile].AttackCount = 0

			GameState[battle.Tile].Color = PlayerColors[battle.Attacker]
			delete(Battles, uuid_)

		} else {
			Battles[uuid_] = battle
		}
	}

	server.BroadcastToNamespace("", "battleUpdate", Battles)
}
