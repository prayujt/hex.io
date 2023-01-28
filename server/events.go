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

	go func() {
		for {
			gameUpdate()
			time.Sleep(time.Millisecond * 1000)
		}
	}()

	rand.Seed(time.Now().UnixNano())
	for i := 0; i < NUM_HEXAGONS; i++ {
		production_value := ProductionValues[rand.Intn(len(ProductionValues)-1)]
		GameState = append(GameState, Hexagon{
			HexId:       i,
			TileState:   "neutral",
			Owner:       "None",
			Count:       0,
			Production:  production_value,
			MaxCapacity: production_value * (rand.Intn(MAX_SCALE-MIN_SCALE) + MIN_SCALE),
			AttackCount: 0,
		})
	}
}
