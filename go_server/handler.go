package main

import (
    // "io"
    "net/http"
	"encoding/json"
)

type User struct {
	Id   int
	Name string
}


func hello(w http.ResponseWriter, r *http.Request) {
	response := struct {
		ErrorCode   string `json:"error_code"`
	}{ErrorCode: "success"}
	b, err := json.Marshal(response)
	if err != nil {
		// HttpError(w, "json format error")
		return
	}
	_, _ = w.Write(b)
    // io.WriteString(w, "Hello world!")
}
