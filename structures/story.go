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
		"Date":         p.Date.Format(time.RFC3339),
		"Situation":    p.Situation,
		"Mind":         p.Mind,
		"Emotion":      p.Emotion,
		"EmotionPower": p.EmotionPower,
	}
}
