package misc

import (
	"github.com/joho/godotenv"
	"log"
	"os"
	"strconv"
)

var (
	Port  string
	DEBUG bool
)

func init() {
	var err error
	// loads values from .env into the system
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}
	Port = getEnv("PORT", "8181")
	if DEBUG, err = strconv.ParseBool(getEnv("DEBUG", "false")); err != nil {
		panic(err)
	}
}

func getEnv(key, defaultValue string) string {
	var exists bool
	var val string
	val, exists = os.LookupEnv(key)
	//fmt.Printf("key=%s val=%s, exists=%v\n", key, val, exists)
	if !exists {
		val = defaultValue
	}
	return val
}
