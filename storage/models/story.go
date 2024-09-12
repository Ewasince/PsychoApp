package models

import (
	"time"
)

type Story struct {
	BaseModel
	Date      time.Time
	Situation string
	Mind      string
	Emotion   string
	Power     uint8
	PatientId uint
}
