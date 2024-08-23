package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type login struct {
	Username string `form:"username" json:"username" binding:"required"`
	Password string `form:"password" json:"password" binding:"required"`
}

var (
	identityKey = "id"
	usernameKey = "username"
	port        string
)

// User demo
type User struct {
	id        float64
	username  string
	password  string `private:"true"`
	FirstName string
	LastName  string
}

func init() {
	port = os.Getenv("PORT")
	if port == "" {
		port = "8181"
	}
}

//	var users = map[string]User{
//		"admin": {
//			id:        10,
//			username:  "adminUserName",
//			FirstName: "adminFirstName",
//			LastName:  "adminLastName",
//			password:  "admin",
//		},
//		"qwer": {
//			id:        11,
//			username:  "qwerUserName",
//			FirstName: "qwerFirstName",
//			LastName:  "qwerLastName",
//			password:  "qwer",
//		},
//	}
var usersCreds = map[string]User{}
var usersByIds = map[float64]User{}
var users = []User{
	{
		id:        0,
		username:  "admin",
		FirstName: "adminFirstName",
		LastName:  "adminLastName",
		password:  "admin",
	},
	{
		id:        1,
		username:  "qwer",
		FirstName: "qwerFirstName",
		LastName:  "qwerLastName",
		password:  "qwer",
	},
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

	//prepare users data
	for _, user := range users {
		usersCreds[user.username] = user
	}
	for _, user := range users {
		usersByIds[user.id] = user
	}

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

func payloadFunc() func(data interface{}) jwt.MapClaims {
	return func(data interface{}) jwt.MapClaims {
		if v, ok := data.(*User); ok {
			return jwt.MapClaims{
				identityKey: v.id,
				usernameKey: v.username,
			}
		}
		return jwt.MapClaims{}
	}
}

func identityHandler() func(c *gin.Context) interface{} {
	return func(c *gin.Context) interface{} {
		claims := jwt.ExtractClaims(c)

		fmt.Printf("identityHandler user_id0=%v\n", claims[identityKey])
		user_id := claims[identityKey].(float64)
		user := usersByIds[user_id]
		//if err {
		//	panic("Cannot find user")
		//}
		fmt.Printf("identityHandler user_id=%v\n", user_id)
		fmt.Printf("identityHandler user=%v\n", user)
		return &User{
			id:        user.id,
			username:  user.username,
			FirstName: user.FirstName,
			LastName:  user.LastName,
		}
	}
}

func authenticator() func(c *gin.Context) (interface{}, error) {
	return func(c *gin.Context) (interface{}, error) {
		var loginVals login
		if err := c.ShouldBind(&loginVals); err != nil {
			return "", jwt.ErrMissingLoginValues
		}
		username := loginVals.Username
		password := loginVals.Password

		fmt.Printf("usersCreds=%v\n", usersCreds)
		fmt.Printf("usersByIds=%v\n", usersByIds)

		user, ok := usersCreds[username]

		if !ok {
			return nil, jwt.ErrFailedAuthentication
		}

		if user.password != password {
			return nil, jwt.ErrFailedAuthentication
		}

		return &user, nil
	}
}

func authorizator() func(data interface{}, c *gin.Context) bool {
	return func(data interface{}, c *gin.Context) bool {
		//fmt.Printf("authorizator %s\n", data.(*User))
		//if v, ok := data.(*User); ok && v.UserName == "admin" {
		//	return true
		//}
		//return false.
		return true
	}
}

func unauthorized() func(c *gin.Context, code int, message string) {
	return func(c *gin.Context, code int, message string) {
		c.JSON(code, gin.H{
			"code":    code,
			"message": message,
		})
	}
}

func handleNoRoute() func(c *gin.Context) {
	return func(c *gin.Context) {
		claims := jwt.ExtractClaims(c)
		log.Printf("NoRoute claims: %#v\n", claims)
		c.JSON(404, gin.H{"code": "PAGE_NOT_FOUND", "message": "Page not found"})
	}
}

func handleBase() func(c *gin.Context) {
	return func(c *gin.Context) {
		claims := jwt.ExtractClaims(c)
		log.Printf("kek claims: %#v\n", claims)
		//c.JSON(404, gin.H{"code": "PAGE_NOT_FOUND", "message": "Page not found"})
		c.File("public/index.html")
	}
}

func helloHandler(c *gin.Context) {
	claims := jwt.ExtractClaims(c)
	user, _ := c.Get(identityKey)
	c.JSON(200, gin.H{
		"userID":   claims[identityKey],
		"username": user.(*User).username,
		"text":     "Hello World.",
	})
}

func getMeHandler(c *gin.Context) {
	//claims := jwt.ExtractClaims(c)
	user, exists := c.Get(identityKey)
	if !exists {
		c.JSON(404, gin.H{"code": "USER_NOT_FOUND", "message": "User not found"})
		return
	}
	userStruct := user.(*User)
	fmt.Printf("getMeHandler userStruct=%v\n", *userStruct)
	c.JSON(200, gin.H{
		"id":       userStruct.id,
		"username": userStruct.username,
		//"FirstName": userStruct.FirstName,
		//"LastName":  userStruct.LastName,
	})
}
