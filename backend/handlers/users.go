package handlers

import (
	. "EnvironmentModule"
	e "PsychoAppAdmin/errors"
	. "StorageModule/models"
	"github.com/gin-gonic/gin"
)

func GetMeHandler(c *gin.Context) {
	user, exists := c.Get(IdentityKey)
	if !exists {
		e.JSONError(c, e.UserNotFound)
		return
	}
	userStruct := user.(*User).ToMap()
	userConfig := GetFrontConfig()

	c.JSON(200, gin.H{
		"user":   userStruct,
		"config": userConfig,
	})
}
