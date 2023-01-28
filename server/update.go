package main

import (
	"context"
	// socketio "github.com/googollee/go-socket.io"
)

type Hexagon struct {
	Hex_id       int
	TileState    string
	Owner        string
	Count        int
	Production   int
	Max_capacity int
	Attack_Count int
}

var GameState []Hexagon

func gameUpdate(ctx context.Context) {
	// server := ctx.Value("server").(*socketio.Server)
}
