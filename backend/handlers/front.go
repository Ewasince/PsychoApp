package handlers

import (
	e "PsychoApp/backend/errors"
	. "PsychoApp/environment"
	"github.com/gin-gonic/gin"
	"log"
	"strings"
)

func HandleFrontendRoute() func(c *gin.Context) {
	return func(c *gin.Context) {
		path := c.Request.URL.Path
		log.Println("no route path ", path)
		if strings.HasPrefix(path, ApiGroupPrefix) {
			log.Println("no route error")
			e.JSONError(c, e.RouteNotFound)
			return
		}
		log.Println("no route return front")
		// should be frontend endpoint
		c.File(Env.FRONTEND_PATH + "/index.html")
	}
}
