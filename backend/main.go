package main

import (
	"PsychoApp/backend/handlers"
	. "PsychoApp/environment"
	"PsychoApp/logger"
	"net/http"
	"time"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	engine := gin.Default()

	// add cors middleware
	engine.Use(cors.New(cors.Config{
		AllowOrigins:     Env.CORS_ORIGINS,
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
		logger.Log.Fatal("JWT Error:" + err.Error())
	}
	engine.Use(handlerMiddleWare(authMiddleware))

	// register route for auth
	handlers.SetHandle(authMiddleware)
	handlers.RegisterRoutes(engine)

	// start http server
	if err = http.ListenAndServe(":"+Env.PORT, engine); err != nil {
		logger.Log.Fatal(err)
	}
}

func handlerMiddleWare(authMiddleware *jwt.GinJWTMiddleware) gin.HandlerFunc {
	return func(context *gin.Context) {
		errInit := authMiddleware.MiddlewareInit()
		if errInit != nil {
			logger.Log.Fatal("authMiddleware.MiddlewareInit() Error:" + errInit.Error())
		}
	}
}

func initParams() *jwt.GinJWTMiddleware {

	return &jwt.GinJWTMiddleware{
		Realm:       Env.JWT_REALM,
		Key:         []byte(Env.JWT_SECRET),
		Timeout:     time.Hour,
		MaxRefresh:  time.Hour * 24 * 4,
		IdentityKey: handlers.IdentityKey,
		PayloadFunc: handlers.PayloadFunc(),

		IdentityHandler: handlers.IdentityHandler(),
		Authenticator:   handlers.Authenticator(),
		//Authorizator:    authorizator(),
		Unauthorized:  handlers.Unauthorized(),
		LoginResponse: handlers.LoginResponse(),
		TokenLookup:   "header: Authorization, query: token, cookie: jwt",
		// TokenLookup: "query:token",
		// TokenLookup: "cookie:token",
		TokenHeadName: "Bearer",
		TimeFunc:      time.Now,
	}
}
