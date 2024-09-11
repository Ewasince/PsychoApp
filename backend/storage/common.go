package storage

import (
	st "StorageModule"
	"database/sql"
)

var DB *sql.DB

func init() {
	DB = st.GetSQLiteDB()
}
