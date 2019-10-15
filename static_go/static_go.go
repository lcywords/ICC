package main

import (
	"log"
	"net/http"
	"os"
)

func main() {
	mux := http.NewServeMux()

	wd, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	mux.Handle("/", http.FileServer(http.Dir(wd) + "/static/"))

	log.Println("server listening on 1024...")

	err = http.ListenAndServe(":1024", mux)
	if err != nil {
		log.Fatal(err)
	}
}
