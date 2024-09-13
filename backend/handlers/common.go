package handlers

import (
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
)

var Handle *jwt.GinJWTMiddleware

var ApiGroupPrefix = "/api"

func SetHandle(h *jwt.GinJWTMiddleware) {
	Handle = h
}

func RegisterRoutes(e *gin.Engine) {
	if Handle == nil {
		panic("You must set auth handle!")
	}
	e.NoRoute(HandleNoRoute())

	api := e.Group(ApiGroupPrefix)
	registerApi(api)

	auth := api.Group("/auth")
	registerAuth(auth)
}

func registerApi(api *gin.RouterGroup) {
	api.Use(skipLoginAuthentication(Handle.MiddlewareFunc()))
	api.GET("/patient", GetPatientsHandler)
	api.GET("/patient/:id", GetPatientHandler)
	api.GET("/patient/:id/story", GetPatientStoriesHandler)
}

func registerAuth(auth *gin.RouterGroup) {
	auth.POST("/login", Handle.LoginHandler)
	auth.GET("/get_me", GetMeHandler)
	auth.GET("/refresh_token", Handle.RefreshHandler)
}
