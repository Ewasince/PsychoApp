package models

import (
	"github.com/gin-gonic/gin"
	"time"
)

type SeverityMark uint8

const (
	Attention0 SeverityMark = iota
	Attention1 SeverityMark = iota
	Attention2 SeverityMark = iota
	Attention3 SeverityMark = iota
)

type Story struct {
	BaseModel
	Date      time.Time
	Situation string
	Mind      string
	Emotion   string
	Power     uint8 // 1 to 10
	PatientId uint
	Mark      SeverityMark `gorm:"default:null"`
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
		"mark":         s.Mark,
	}
}
