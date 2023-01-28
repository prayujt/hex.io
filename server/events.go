package main

import (
	"math/rand"
	"time"
)

var ProductionValues = []int{1, 2, 3, 5, 10, 15, 20, 25}

const MIN_SCALE int = 5
const MAX_SCALE int = 20

const NUM_HEXAGONS int = 100

func initializeGame() {
	rand.Seed(time.Now().UnixNano())
	for i := 0; i < NUM_HEXAGONS; i++ {
		owner := "None"
		if i%2 == 0 {
			owner = "Prayuj"
		} else if i%3 == 0 {
			owner = "Kaniel"
		}
		production_value := ProductionValues[rand.Intn(len(ProductionValues)-1)]
		GameState = append(GameState, Hexagon{
			HexId:       i,
			TileState:   "neutral",
			Owner:       owner,
			Count:       0,
			Production:  production_value,
			MaxCapacity: production_value * (rand.Intn(MAX_SCALE-MIN_SCALE) + MIN_SCALE),
			AttackCount: 0,
		})
	}

	server.BroadcastToNamespace("", "gameStarted", GameState)

	go func() {
		time.Sleep(time.Second * 3)
		for {
			gameUpdate()
			time.Sleep(time.Millisecond * 1000)
		}
	}()

	go func() {
		time.Sleep(time.Second * 3)
		for {
			barUpdate()
			time.Sleep(time.Millisecond * 1000)
		}
	}()
}
