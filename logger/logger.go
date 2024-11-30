package logger

import (
	"PsychoApp/environment"
	"io"
	"log"
	"os"
	"path/filepath"
)

var (
	Log *log.Logger
)

func init() {
	// set location of log file
	var logPath = environment.Env.LOG_PATH
	logPath, err := filepath.Abs(logPath)
	if err != nil {
		panic(err)
	}

	file, err := os.OpenFile(logPath, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatalf("Error opening log file: %v", err)
	}

	multiWriter := io.MultiWriter(file, os.Stdout)
	Log = log.New(multiWriter, "", log.LstdFlags|log.Lshortfile)
	Log.Println("logger initialized for: " + logPath)
}
