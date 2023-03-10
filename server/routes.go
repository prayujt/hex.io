package main

import (
	"log"
	"net/http"

	socketio "github.com/googollee/go-socket.io"
	"github.com/googollee/go-socket.io/engineio"
	"github.com/googollee/go-socket.io/engineio/transport"
	"github.com/googollee/go-socket.io/engineio/transport/polling"
	"github.com/googollee/go-socket.io/engineio/transport/websocket"
	// "github.com/mitchellh/mapstructure"
)

var allowOriginFunc = func(r *http.Request) bool {
	return true
}

var server *socketio.Server

func main() {
	log.SetFlags(log.LstdFlags | log.Lmicroseconds)
	server = socketio.NewServer(&engineio.Options{
		Transports: []transport.Transport{
			&polling.Transport{
				CheckOrigin: allowOriginFunc,
			},
			&websocket.Transport{
				CheckOrigin: allowOriginFunc,
			},
		},
	})

	server.OnConnect("/", func(s socketio.Conn) error {
		log.Println("connected:", s.ID())
		return nil
	})

	server.OnError("/", func(s socketio.Conn, e error) {
		log.Println("error:", e)
	})

	server.OnDisconnect("/", func(s socketio.Conn, reason string) {
		log.Println("closed", reason)
	})

	go func() {
		if err := server.Serve(); err != nil {
			log.Fatalf("socketio listen error: %s\n", err)
		}
	}()
	defer server.Close()

	http.Handle("/socket.io/", server)

	http.HandleFunc("/names", getNames)
	http.HandleFunc("/updateName", updateName)
	http.HandleFunc("/playerReady", playerReady)
	http.HandleFunc("/readyStatus", getReadyStatus)

	http.HandleFunc("/move", move)
	http.HandleFunc("/movements", getMovements)

	http.HandleFunc("/battles", getBattles)

	http.HandleFunc("/colors", getColors)

	log.Println("Serving at localhost:8000...")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
