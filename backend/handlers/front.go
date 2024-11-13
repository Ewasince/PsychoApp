package handlers

import (
	e "PsychoApp/backend/errors"
	. "PsychoApp/environment"
	"github.com/gin-gonic/gin"
	"strings"
)

func HandleFrontendRoute() func(c *gin.Context) {
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
