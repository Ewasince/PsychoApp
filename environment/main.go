package environment

import (
	"github.com/joho/godotenv"
	"log"
	"os"
	"strconv"
)

var (
	PORT            string
	DEBUG           bool
	MIGRATIONS_PATH string
	DB_PATH         string
)

func init() {
	var err error
	// loads values from .env into the system
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}

	// PORT
	PORT = getEnv("PORT", "8181")

	// DEBUG
	if DEBUG, err = strconv.ParseBool(getEnv("DEBUG", "false")); err != nil {
		panic(err)
	}

	// MIGRATIONS_PATH
	MIGRATIONS_PATH = "file://" + getEnv("MIGRATIONS_PATH", "")

	// DB_PATH
	DB_PATH = getEnv("DATABASE_PATH", "")
}

func getEnv(key, defaultValue string) string {
	val, exists := os.LookupEnv(key)

	if exists {
		return val
	}
	if defaultValue != "" {
		return defaultValue
	}
	panic("No value for " + key)
}
