package main

import (
	"context"
	socketio "github.com/googollee/go-socket.io"
)

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

func gameUpdate(ctx context.Context) {
	server := ctx.Value("server").(*socketio.Server)
	for idx, hex := range GameState {
		if hex.Count < hex.MaxCapacity {
			hex.Count += hex.Production
		}
		GameState[idx] = hex
	}
	server.BroadcastToNamespace("", "gameUpdate", GameState)
}
