package handlers

import (
	"PsychoAppAdmin/errors"
	. "PsychoAppAdmin/structures"
	"github.com/gin-gonic/gin"
)

func GetMeHandler(c *gin.Context) {
	user, exists := c.Get(IdentityKey)
	if !exists {
		errors.UserNotFound.JSONError(c)
		return
	}
	userStruct := user.(*User)
	c.JSON(200, userStruct.ToMap())
}
