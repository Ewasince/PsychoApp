package models

import (
	"github.com/fatih/structs"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"time"
)

type BaseModel struct {
	gorm.Model
}

// ToMap turn User struct into map
func (b *BaseModel) ToMap() gin.H {
	return structs.Map(b)
}

// Init implements DbEntity[Patient]
func (b *BaseModel) Init() *BaseModel {
	(*b).CreatedAt = time.Now()
	return b
}
