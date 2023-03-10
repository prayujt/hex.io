package main

import (
	"encoding/json"
	"math"
	"math/rand"
	"net/http"
	"time"

	"github.com/google/uuid"
)

var ProductionValues = []int{1, 2, 3, 5, 10, 15, 20, 25}
var PlayerColors map[string]string

var colors = []string{"blue", "green", "purple", "yellow", "brown"}

const MIN_SCALE int = 5
const MAX_SCALE int = 20

const NUM_HEXAGONS int = 91

var Moves map[uuid.UUID]HexMove

type PlayerColor struct {
	Username string
	Color    string
}

type HexMove struct {
	Uuid     uuid.UUID
	Username string
	From     int
	To       int
	Count    float64
	Time     int
	Sender   string
}

var UpdatesPerSecond float64 = 0.0
var Frequency float64

func initializeGame() {
	rand.Seed(time.Now().UnixNano())
	PlayerColors = make(map[string]string)

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

	go func() {
		time.Sleep(time.Second * 2)
		for {
			trackBattles()
			time.Sleep(time.Millisecond * 100)
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

	if movement.Username == fromHex.Owner {
		newHex := fromHex
		newHex.Count = 0
		GameState[movement.From] = newHex
		movement.Count = sendAmount
		movement.Sender = fromHex.Owner

		if len(Moves) == 0 {
			Moves = make(map[uuid.UUID]HexMove)
		}
		Moves[uuid.New()] = movement
	}
}

func getMovements(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(Moves)
}

func getBattles(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(Battles)
}

func getColors(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	var tempColors []PlayerColor
	for username, color := range PlayerColors {
		if username != "Neutral" {
			tempColors = append(tempColors, PlayerColor{Username: username, Color: color})
		}
	}
	json.NewEncoder(w).Encode(tempColors)
}
