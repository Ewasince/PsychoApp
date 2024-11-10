package handlers

import (
	environment "PsychoApp/environment"
	"github.com/gin-gonic/gin"
)

func GetFrontConfig(c *gin.Context) {

	userConfig := environment.BuildFrontConfig()

	c.JSON(200, gin.H{
		"config": userConfig,
	})
}
