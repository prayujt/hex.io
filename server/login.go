package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

var names map[string]string
var readyStatus map[string]bool

type Player struct {
	Uuid     string
	Username string
}

func getNames(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	var usernames []string

	for _, username := range names {
		usernames = append(usernames, username)
	}
	log.Println("Received request at /names...")
	json.NewEncoder(w).Encode(usernames)
}

func updateName(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if len(names) == 0 {
		names = make(map[string]string)
	}

	var player Player
	err := json.NewDecoder(r.Body).Decode(&player)
	if err != nil {
		panic(err)
	}
	names[player.Uuid] = player.Username

	if len(readyStatus) == 0 {
		readyStatus = make(map[string]bool)
	}
	readyStatus[player.Uuid] = false

	fmt.Fprintf(w, "updated name")
}

func playerReady(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	var player Player
	err := json.NewDecoder(r.Body).Decode(&player)
	if err != nil {
		panic(err)
	}

	if ready, exists := readyStatus[player.Uuid]; exists {
		readyStatus[player.Uuid] = !ready
	} else {
		readyStatus[player.Uuid] = true
	}
	fmt.Fprintf(w, "ready status updated")

	var startGame bool = true
	for _, val := range readyStatus {
		startGame = startGame && val
	}

	if startGame {
		log.Println("All players are ready!")
		initializeGame()
	}
}
