package main

import (
	"log"
	"net/http"
	"os"
	"time"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var (
	identityKey = "id"
	usernameKey = "username"
	port        string
)

func init() {
	port = os.Getenv("PORT")
	if port == "" {
		port = "8181"
	}
}

func main() {
	engine := gin.Default()

	// add cors middleware
	engine.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:8181"},
		AllowMethods:     []string{"POST", "OPTIONS", "GET", "PUT"},
		AllowHeaders:     []string{"Content-Type", "Content-Length", "Accept-Encoding", "Cache-Control", "Authorization", "Control-Allow-Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		//AllowOriginFunc: func(origin string) bool {
		//	return origin == "https://github.com"
		//},
		MaxAge: 12 * time.Hour,
	}))

	// add jwt middleware
	authMiddleware, err := jwt.New(initParams())
	if err != nil {
		log.Fatal("JWT Error:" + err.Error())
	}
	engine.Use(handlerMiddleWare(authMiddleware))

	// register route for auth
	registerRoute(engine, authMiddleware)

	// start http server
	if err = http.ListenAndServe(":"+port, engine); err != nil {
		log.Fatal(err)
	}
}

func registerRoute(r *gin.Engine, handle *jwt.GinJWTMiddleware) {
	r.NoRoute(handle.MiddlewareFunc(), handleNoRoute())

	//r.GET("/", handleBase())

	api := r.Group("/api")
	api.POST("login", handle.LoginHandler)

	auth := api.Group("/auth", handle.MiddlewareFunc())
	auth.GET("/get_me", getMeHandler)
	auth.GET("/refresh_token", handle.RefreshHandler)
	auth.GET("/hello", helloHandler)
}

func handlerMiddleWare(authMiddleware *jwt.GinJWTMiddleware) gin.HandlerFunc {
	return func(context *gin.Context) {
		errInit := authMiddleware.MiddlewareInit()
		if errInit != nil {
			log.Fatal("authMiddleware.MiddlewareInit() Error:" + errInit.Error())
		}
	}
}

func initParams() *jwt.GinJWTMiddleware {

	return &jwt.GinJWTMiddleware{
		Realm:       "test zone",
		Key:         []byte("secret key"),
		Timeout:     time.Hour,
		MaxRefresh:  time.Hour,
		IdentityKey: identityKey,
		PayloadFunc: payloadFunc(),

		IdentityHandler: identityHandler(),
		Authenticator:   authenticator(),
		Authorizator:    authorizator(),
		Unauthorized:    unauthorized(),
		TokenLookup:     "header: Authorization, query: token, cookie: jwt",
		// TokenLookup: "query:token",
		// TokenLookup: "cookie:token",
		TokenHeadName: "Bearer",
		TimeFunc:      time.Now,
	}
}
