package main

import (
    "io"
	"net/http"
)

type myHandler struct{}

func (*myHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    if h, ok := mux[r.URL.String()]; ok {
        h(w, r)
        return
    }

    io.WriteString(w, "My server: "+r.URL.String())
}

var mux map[string]func(http.ResponseWriter, *http.Request)

func main() {
    server := http.Server{
        Addr:    ":8000",
        Handler: &myHandler{},
    }

    mux = make(map[string]func(http.ResponseWriter, *http.Request))
	initMux(mux)

    server.ListenAndServe()
}
