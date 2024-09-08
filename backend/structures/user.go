package structures

import "github.com/gin-gonic/gin"

// User demo
type UserId int
type User struct {
	Id        UserId
	Username  string
	Password  string `private:"true"`
	FirstName string
	LastName  string
}

// ToMap turn User struct into map
func (u *User) ToMap() gin.H {
	return map[string]interface{}{
		"id":       u.Id,
		"username": u.Username,
		//"FirstName": u.FirstName,
		//"LastName": u.LastName,
	}
}
