package structures

import (
	"github.com/gin-gonic/gin"
	"time"
)

type StoryId int
type Story struct {
	Id           StoryId
	Date         time.Time
	Situation    string
	Mind         string
	Emotion      string
	EmotionPower int8
}

// ToMap turn Story struct into map
func (p *Story) ToMap() gin.H {
	return map[string]interface{}{
		"id":           p.Id,
		"date":         p.Date.Format(time.RFC3339),
		"situation":    p.Situation,
		"mind":         p.Mind,
		"emotion":      p.Emotion,
		"emotionPower": p.EmotionPower,
	}
}
