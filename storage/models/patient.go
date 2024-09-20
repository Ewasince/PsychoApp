package models

import (
	"github.com/gin-gonic/gin"
	"time"
)

type Patient struct {
	BaseModel
	Name         string
	LastName     string
	Email        string
	Username     string
	Password     string
	UserId       uint
	TgId         int64
	NextSchedule *time.Time `gorm:"default:null"`
}

// ToMap turn Patient struct into map
func (p *Patient) ToMap() gin.H {
	return map[string]any{
		"id":        p.ID,
		"firstName": p.Name,
		"lastName":  p.LastName,
	}
}
