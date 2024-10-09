package environment

import "github.com/gin-gonic/gin"

func BuildFrontConfig() gin.H {
	return gin.H{
		"is_dev": Env.DEBUG,
	}
}
