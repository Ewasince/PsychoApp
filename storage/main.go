package storage

import (
	env "EnvironmentModule"
	"database/sql"
	"fmt"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/mattn/go-sqlite3"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
)

func init() {

	if env.DEBUG {
		resetDb()
	} else {
		migrateDb()
	}
}

func migrateDb() {
	fmt.Println("Migrating database...")
	//Подключение к базе данных
	db, err := sql.Open("sqlite3", env.DB_PATH)
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
		env.MIGRATIONS_PATH,
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
	db, err := sql.Open("sqlite3", env.DB_PATH)
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
		env.MIGRATIONS_PATH,
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
	db, err := gorm.Open(sqlite.Open(env.DB_PATH), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	return db
}
