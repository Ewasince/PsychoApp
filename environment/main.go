package environment

import (
	"fmt"
	"github.com/joho/godotenv"
	"log"
	"os"
	"reflect"
	"strconv"
	"strings"
	"text/tabwriter"
)

type environmentVariables struct {
	DEBUG bool
	DEV   bool

	PORT         string
	CORS_ORIGINS []string

	JWT_SECRET string
	JWT_REALM  string

	IMAGES_PATH     string
	MIGRATIONS_PATH string
	DB_URI          string
	DB_DSN          string
	FRONTEND_PATH   string

	BOT_TOKEN      string
	DEV_USER_TG_ID int64

	LOG_PATH string
}

var Env = environmentVariables{}

func init() {
	var err error
	// loads values from .env into the system
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
		err = nil
	}

	// PORT
	Env.PORT = getEnv("PORT", "8181")

	// DEBUG
	if Env.DEBUG, err = strconv.ParseBool(getEnv("DEBUG", "false")); err != nil {
		panic(err)
	}

	// DEV
	if Env.DEV, err = strconv.ParseBool(getEnv("DEV", "false")); err != nil {
		panic(err)
	}

	// IMAGES_PATH
	Env.IMAGES_PATH = getEnv("IMAGES_PATH", "")

	// MIGRATIONS_PATH
	Env.MIGRATIONS_PATH = "file://" + getEnv("MIGRATIONS_PATH", "")

	// helpers for db

	postgresUser := getEnv("POSTGRES_USER", "")
	postgresPassword := getEnv("POSTGRES_PASSWORD", "")
	postgresDb := getEnv("POSTGRES_DB", "")
	postgresPort := getEnv("POSTGRES_PORT", "")
	postgresHost := getEnv("POSTGRES_HOST", "")

	// DB_URI
	Env.DB_URI = fmt.Sprintf(
		"postgresql://%s:%s@%s:%s/%s?sslmode=disable",
		postgresUser,
		postgresPassword,
		postgresHost,
		postgresPort,
		postgresDb,
	)

	// DB_DSN
	Env.DB_DSN = fmt.Sprintf(
		"host=%s "+
			"user=%s "+
			"password=%s "+
			"dbname=%s "+
			"port=%s "+
			"sslmode=disable "+
			"TimeZone=Europe/Moscow",
		postgresHost,
		postgresUser,
		postgresPassword,
		postgresDb,
		postgresPort,
	)

	// FRONTEND_PATH
	Env.FRONTEND_PATH = strings.Trim(getEnv("FRONTEND_PATH", ""), "/")

	// FRONTEND_PATH
	Env.CORS_ORIGINS = strings.Split(getEnv("CORS_ORIGINS", ""), ",")

	// BOT_TOKEN
	Env.BOT_TOKEN = getEnv("BOT_TOKEN", "")

	// JWT_SECRET
	Env.JWT_SECRET = getEnv("JWT_SECRET", "")

	// JWT_REALM
	Env.JWT_REALM = getEnv("JWT_REALM", "default zone")

	// DEV_USER_TG_ID
	DEV_USER_TG_ID, err := strconv.Atoi(getEnv("DEV_USER_TG_ID", "0"))
	if err != nil {
		panic(err)
	}
	Env.DEV_USER_TG_ID = int64(DEV_USER_TG_ID)

	// LOG_PATH
	Env.LOG_PATH = getEnv("LOG_PATH", "logs/logs.log")

	printEnvVariables()
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

func printEnvVariables() {
	fmt.Println("Environment Variables:")

	// Получаем значение и тип структуры
	val := reflect.ValueOf(Env)
	fields := reflect.VisibleFields(reflect.TypeOf(Env))

	// Итерируемся по полям структуры
	w := tabwriter.NewWriter(os.Stdout, 1, 1, 1, ' ', 0)
	for _, field := range fields {
		fieldValue := val.FieldByName(field.Name)
		fmt.Fprintf(w, "%s=\t%v\n", field.Name, fieldValue.Interface())
	}
	w.Flush()
}
