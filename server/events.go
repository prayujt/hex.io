package main

import (
	// "log" "encoding/json"
	"encoding/json"
	"math"
	"math/rand"
	"net/http"
	"time"
)

var ProductionValues = []int{1, 2, 3, 5, 10, 15, 20, 25}
var Colors map[string]string

var colors = []string{"blue", "green", "red", "yellow"}

const MIN_SCALE int = 5
const MAX_SCALE int = 20

const NUM_HEXAGONS int = 91

var Moves []HexMove

type HexMove struct {
	From  int
	To    int
	Count float64
	Time  int
}

var UpdatesPerSecond float64 = 0.0
var Frequency float64

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

		productionValue := float64(ProductionValues[rand.Intn(len(ProductionValues)-1)])
		if productionValue > UpdatesPerSecond {
			UpdatesPerSecond = productionValue
		}
		GameState = append(GameState, Hexagon{
			HexId:       i,
			TileState:   "neutral",
			Owner:       owner,
			Count:       0,
			Production:  productionValue,
			MaxCapacity: productionValue * float64(rand.Intn(MAX_SCALE-MIN_SCALE)+MIN_SCALE),
			AttackCount: 0,
			Color:       PlayerColors[owner],
		})
	}

	Frequency = 1000 / float64(UpdatesPerSecond)

	server.BroadcastToNamespace("", "gameStarted", GameState)

	go func() {
		time.Sleep(time.Second * 2)
		for {
			gameUpdate()
			time.Sleep(time.Millisecond * time.Duration(Frequency))
		}
	}()

	go func() {
		time.Sleep(time.Second * 2)
		for {
			barUpdate()
			time.Sleep(time.Millisecond * time.Duration(Frequency))
		}
	}()

	go func() {
		time.Sleep(time.Second * 2)
		for {
			trackMovements()
			time.Sleep(time.Second)
		}
	}()
}

func move(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	var movement HexMove
	err := json.NewDecoder(r.Body).Decode(&movement)
	if err != nil {
		panic(err)
	}
	fromHex := GameState[movement.From]
	sendAmount := fromHex.Count

	newHex := fromHex
	newHex.Count = 0
	GameState[movement.From] = newHex
	movement.Count = sendAmount

	Moves = append(Moves, movement)
}

func getMovements(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(Moves)
}
