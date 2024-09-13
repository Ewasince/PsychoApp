package handlers

import (
	. "EnvironmentModule"
	e "PsychoAppAdmin/errors"
	. "StorageModule/models"
	"github.com/gin-gonic/gin"
	"strings"
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

func HandleNoRoute() func(c *gin.Context) {
	return func(c *gin.Context) {
		path := c.Request.URL.Path
		if strings.HasPrefix(path, ApiGroupPrefix) {
			e.JSONError(c, e.RouteNotFound)
			return
		}
		// should be frontend endpoint
		c.File(Env.FRONTEND_PATH + "/index.html")
	}
}
