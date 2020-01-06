package service

import (
	"fmt"
	"log"
	"net/http"
	"github.com/gorilla/mux"
	"time"
)

func MiddleHandler(inner http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		a := vars["username"]
		fmt.Println("username:", a)
		log.Println("middleware 1", r.RequestURI)
		//w.Write([]byte("dsifhsidfhsi"))
		//return
		w.Header().Set("Content-Type", "application/json; charset=UTF-8")
		//w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Origin", r.Header.Get("Origin"))
		//w.Header().Set("Access-Control-Allow-Origin", "http://localhost:58870")
		//w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,POST")
		w.Header().Set("Access-Control-Allow-Headers", "content-type")
		//w.Header().Set("Access-Control-Max-Age", "1800")
		inner.ServeHTTP(w, r)
		log.Println("middleware 2", r.RequestURI)
	})
}

func Logger(inner http.Handler, name string) http.Handler{
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		inner.ServeHTTP(w, r)
		log.Printf("%s %s %s %s", r.Method, r.RequestURI, name, time.Since(start),)
	})
}
