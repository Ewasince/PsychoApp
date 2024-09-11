package migrate

import (
	"database/sql"
	"fmt"
	"github.com/joho/godotenv"
	"os"

	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/mattn/go-sqlite3"
)

var migrationsPath string
var dbPath string

func init() {
	// loads values from .env into the system
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}

	migrationsPath = "file://" + getEnvVar("MIGRATIONS_PATH", "No migrations path provided")
	fmt.Printf("Migrations path: '%s'\n", migrationsPath)

	dbPath = getEnvVar("DATABASE_PATH", "No database path provided")
	fmt.Printf("Database path: '%s'\n", dbPath)
}

func getEnvVar(key, fallback string) string {
	value, exists := os.LookupEnv(key)
	if !exists {
		panic(fallback)
	}
	return value
}

func GetSQLiteDB() *sql.DB {
	//Подключение к базе данных
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatalf("Ошибка подключения к базе данных: %v", err)
	}
	defer db.Close()

	// Настройка драйвера миграций для SQLite
	driver, err := sqlite3.WithInstance(db, &sqlite3.Config{})
	if err != nil {
		log.Fatalf("Ошибка создания драйвера миграций: %v", err)
	}

	// Путь к миграциям
	fmt.Printf("Migrations path: '%s'\n", migrationsPath)
	m, err := migrate.NewWithDatabaseInstance(
		migrationsPath,
		"sqlite3",
		driver,
	)
	if err != nil {
		log.Fatalf("Ошибка создания миграции: %v", err)
	}

	// Применение миграций "вперед"
	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("Ошибка применения миграций: %v", err)
	}

	fmt.Println("Миграции успешно применены!")
	return db
}
