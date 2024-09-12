package storage

import (
	"database/sql"
	"fmt"
	"github.com/joho/godotenv"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"os"
	"strconv"

	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/mattn/go-sqlite3"
)

var migrationsPath string
var dbPath string
var DEBUG bool

func init() {
	var err error
	// loads values from .env into the system
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}

	migrationsPath = "file://" + getEnvVar("MIGRATIONS_PATH", "")
	fmt.Printf("Migrations path: '%s'\n", migrationsPath)

	dbPath = getEnvVar("DATABASE_PATH", "")
	fmt.Printf("Database path: '%s'\n", dbPath)

	if DEBUG, err = strconv.ParseBool(getEnvVar("DEBUG", "false")); err != nil {
		panic(err)
	}

	if DEBUG {
		resetDb()
	} else {
		migrateDb()
	}
}

func getEnvVar(key string, defaultValue string) string {
	value, exists := os.LookupEnv(key)
	if !exists && defaultValue == "" {
		panic("No environment variable " + key)
	}
	return value
}

func migrateDb() {
	fmt.Println("Migrating database...")
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
}

func resetDb() {
	fmt.Println("Reset database...")
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
	m, err := migrate.NewWithDatabaseInstance(
		migrationsPath,
		"sqlite3",
		driver,
	)
	if err != nil {
		log.Fatalf("Ошибка создания миграции: %v", err)
	}

	// Применение миграций "вперед"
	if err := m.Down(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("Ошибка сброса бд: %v", err)
	}

	// Применение миграций "вперед"
	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("Ошибка применения миграций: %v", err)
	}
}

func GetSQLiteDB() *gorm.DB {
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	return db
}
