package storage

import (
	. "PsychoApp/environment"
	"database/sql"
	"fmt"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/mattn/go-sqlite3"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"log"
	"time"
)

func init() {
	migrateDb()
	//if Env.DEBUG {
	//	//resetDb()
	//} else {
	//	migrateDb()
	//}
}

func migrateDb() {
	fmt.Println("Migrating database...")
	//Подключение к базе данных
	db, err := sql.Open("sqlite3", Env.DB_PATH)
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
		Env.MIGRATIONS_PATH,
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
	db, err := sql.Open("sqlite3", Env.DB_PATH)
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
		Env.MIGRATIONS_PATH,
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
	var gormConfig = gorm.Config{}

	if Env.DEBUG {
		// Создаем новый логгер с выводом всех SQL-запросов
		gormLogger := logger.New(
			log.New(log.Writer(), "\r\n", log.LstdFlags), // Логгер для вывода в консоль
			logger.Config{
				SlowThreshold: time.Second, // Порог времени для медленных запросов (вывод в консоль)
				LogLevel:      logger.Info, // Уровень логирования: Info для всех SQL-запросов
				Colorful:      true,        // Включаем цветные логи
			},
		)
		gormConfig.Logger = gormLogger
	}

	db, err := gorm.Open(sqlite.Open(Env.DB_PATH), &gormConfig)
	if err != nil {
		panic("failed to connect database")
	}
	return db
}
