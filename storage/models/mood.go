package models

import (
	"github.com/gin-gonic/gin"
	"time"
)

type Mood struct {
	BaseModel
	PatientId uint
	Date      time.Time
	Value     int8
}

// ToMap turn Mood struct into map
func (m *Mood) ToMap() gin.H {
	return map[string]any{
		"id":    m.ID,
		"date":  m.Date.Unix(),
		"value": m.Value,
	}
}
