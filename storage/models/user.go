package models

import "github.com/gin-gonic/gin"

type User struct {
	BaseModel
	Email    string
	Username string
	Password string
	Salt     string
	Name     string
}

// ToMap turn User struct into map
func (u *User) ToMap() gin.H {
	return map[string]any{
		"id":       u.ID,
		"username": u.Username,
		"email":    u.Email,
		"name":     u.Name,
	}
}
