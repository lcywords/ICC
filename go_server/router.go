package main

import (
    "net/http"
)

func initMux(mux map[string]func(http.ResponseWriter, *http.Request)) {
    mux["/user"] = hello
}
