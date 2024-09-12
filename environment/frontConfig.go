package environment

import "github.com/gin-gonic/gin"

func GetFrontConfig() gin.H {
	return gin.H{
		"is_dev": Env.DEBUG,
	}
}
