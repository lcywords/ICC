package service

import (
	"log"
	"net/http"
	"time"
)

func Logger(inner http.Handler, name string, mlog *log.Logger) (http.Handler, *log.Logger){
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		inner.ServeHTTP(w, r)
		mlog.Printf("%s %s %s %s", r.Method, r.RequestURI, name, time.Since(start),	)
		log.Printf("%s %s %s %s", r.Method, r.RequestURI, name, time.Since(start),)
	}), mlog
}

