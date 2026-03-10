package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"
)

//go:embed dist/*
var distFS embed.FS

func main() {
	subFS, err := fs.Sub(distFS, "dist")
	if err != nil {
		log.Fatal(err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	srv := http.FileServer(http.FS(subFS))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cross-Origin-Opener-Policy", "same-origin")
		w.Header().Set("Cross-Origin-Embedder-Policy", "require-corp")
		srv.ServeHTTP(w, r)
	})

	log.Printf("Server starting on http://localhost:%s\n", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}
