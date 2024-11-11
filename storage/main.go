package storage

import (
	. "PsychoApp/environment"
	"fmt"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"gorm.io/driver/postgres"
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

	// Путь к миграциям
	m, err := migrate.New(
		Env.MIGRATIONS_PATH,
		Env.DB_URI,
	)
	if err != nil {
		log.Fatalf("Ошибка создания миграции: %v", err)
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

	db, err := gorm.Open(postgres.Open(Env.DB_DSN), &gormConfig)
	if err != nil {
		panic("failed to connect database")
	}
	return db
}

//func resetDb() {
//	fmt.Println("Reset database...")
//	//Подключение к базе данных
//	db, err := postgres.Open(Env.DB_DSN)
//	if err != nil {
//		log.Fatalf("Ошибка подключения к базе данных: %v", err)
//	}
//	defer db.Close()
//
//	// Настройка драйвера миграций для SQLite
//	driver, err := sqlite3.WithInstance(db, &sqlite3.Config{})
//	if err != nil {
//		log.Fatalf("Ошибка создания драйвера миграций: %v", err)
//	}
//
//	// Путь к миграциям
//	m, err := migrate.NewWithDatabaseInstance(
//		Env.MIGRATIONS_PATH,
//		"sqlite3",
//		driver,
//	)
//	if err != nil {
//		log.Fatalf("Ошибка создания миграции: %v", err)
//	}
//
//	// Применение миграций "вперед"
//	if err := m.Down(); err != nil && err != migrate.ErrNoChange {
//		log.Fatalf("Ошибка сброса бд: %v", err)
//	}
//
//	// Применение миграций "вперед"
//	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
//		log.Fatalf("Ошибка применения миграций: %v", err)
//	}
//}
