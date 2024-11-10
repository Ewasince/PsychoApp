package handlers

import (
	e "PsychoApp/backend/errors"
	. "PsychoApp/storage/models"
	"PsychoApp/storage/repo"
	"github.com/gin-gonic/gin"
	"log"
)

func GetMeHandler(c *gin.Context) {
	user, exists := c.Get(IdentityKey)
	if !exists {
		e.JSONError(c, e.UserNotFound)
		return
	}
	userStruct := user.(*User).ToMap()

	c.JSON(200, gin.H{
		"user": userStruct,
	})
}

type SingUpForm struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func SingUpUser(c *gin.Context) {
	// fill register form
	var singUpForm SingUpForm
	err := c.BindJSON(&singUpForm)
	if err != nil {
		log.Printf("error singup user: %s", err)
		e.JSONError(c, e.UserNotRegistered)
		return
	}

	// check invite
	if !repo.CheckEmail(singUpForm.Email) {
		log.Printf("user try register without invite: %s", singUpForm)
		e.JSONError(c, e.UserNotRegistered)
		return
	}

	// register user
	_, err = repo.CreateUser(
		singUpForm.Name,
		singUpForm.Username,
		singUpForm.Email,
		singUpForm.Password,
	)
	if err == nil {
		log.Printf("user registered: %s", singUpForm.Username)
		repo.FireEmail(singUpForm.Email)
		return
	}
	log.Printf("error singup user: %s", err)
	if err.Error() == "user already exists" {
		e.JSONError(c, e.UserAlreadyExists)
		return
	}
	e.JSONError(c, e.UserNotRegistered)
	return

}
