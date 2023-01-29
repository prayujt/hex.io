package main

import (
	// "log"
	"math"
	"math/rand"
	"time"
)

var ProductionValues = []int{1, 2, 3, 5, 10, 15, 20, 25}
var Colors map[string]string

var colors = []string{"blue", "green", "red", "yellow"}

const MIN_SCALE int = 5
const MAX_SCALE int = 20

const NUM_HEXAGONS int = 91

func initializeGame() {
	rand.Seed(time.Now().UnixNano())
	PlayerColors := make(map[string]string)

	num_players := len(names)
	increment := int(math.Ceil(float64(NUM_HEXAGONS) / float64(num_players)))
	increment_counter := 0

	var usernameArr []string
	counter := 0
	PlayerColors["Neutral"] = "white"
	for _, username := range names {
		usernameArr = append(usernameArr, username)
		PlayerColors[username] = colors[counter]
		counter += 1
	}

	for i := 0; i < NUM_HEXAGONS; i++ {
		owner := "Neutral"
		if i%increment == 0 {
			owner = usernameArr[increment_counter]
			increment_counter += 1
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
			Color:       PlayerColors[owner],
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
