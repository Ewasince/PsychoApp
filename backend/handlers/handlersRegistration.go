package handlers

import (
	. "EnvironmentModule"
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
	e.NoRoute(HandleFrontendRoute())
	e.StaticFile("/favicon.ico", Env.FRONTEND_PATH+"/favicon.ico")
	e.Static("/static", Env.FRONTEND_PATH+"/static")

	api := e.Group(ApiGroupPrefix)
	registerApi(api)

	auth := api.Group("/auth")
	registerAuth(auth)
}

func registerApi(api *gin.RouterGroup) {
	api.Use(skipLoginAuthentication(Handle.MiddlewareFunc()))
	api.GET("/patient", GetPatientsHandler)                 // api/patient
	api.GET("/patient/:id", GetPatientHandler)              // api/patient/:id
	api.GET("/patient/:id/story", GetPatientStoriesHandler) // api/patient/:id/story
	api.GET("/patient/:id/mood", GetPatientMoodsHandler)    // api/patient/:id/mood
	api.GET("/get_me", GetMeHandler)                        // api/get_me
}

func registerAuth(auth *gin.RouterGroup) {
	auth.POST("/login", Handle.LoginHandler)           // api/auth/login
	auth.POST("/refresh_token", Handle.RefreshHandler) // api/auth/refresh_token
}
