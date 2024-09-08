package storage

import (
	mg "MigrateModule"
	"database/sql"
)

var DB *sql.DB

func init() {
	DB = mg.GetSQLiteDB()
}
