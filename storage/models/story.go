package models

import (
	"github.com/gin-gonic/gin"
	"time"
)

type Story struct {
	BaseModel
	Date      time.Time
	Situation string
	Mind      string
	Emotion   string
	Power     uint8 // 1 to 10
	PatientId uint
}

// ToMap turn Patient struct into map
func (s *Story) ToMap() gin.H {
	return map[string]any{
		"id":           s.ID,
		"date":         s.Date.Unix(),
		"situation":    s.Situation,
		"mind":         s.Mind,
		"emotion":      s.Emotion,
		"emotionPower": s.Power,
	}
}
