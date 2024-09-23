package handlers

import (
	e "PsychoAppAdmin/errors"
	"errors"
	"gorm.io/gorm"
	"net/http"
	"strings"
	"time"

	//"PsychoAppAdmin"
	. "StorageModule/models"
	"StorageModule/repo"
	"fmt"
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
)

const (
	IdentityKey = "id"
	UsernameKey = "username"
)

type login struct {
	Username string `form:"username" json:"username" binding:"required"`
	Password string `form:"password" json:"password" binding:"required"`
}

func PayloadFunc() func(data interface{}) jwt.MapClaims {
	return func(data interface{}) jwt.MapClaims {
		if v, ok := data.(*User); ok {
			return jwt.MapClaims{
				IdentityKey: v.ID,
				UsernameKey: v.Email,
			}
		}
		return jwt.MapClaims{}
	}
}

func IdentityHandler() func(c *gin.Context) interface{} {
	return func(c *gin.Context) interface{} {
		claims := jwt.ExtractClaims(c)

		fmt.Printf("identityHandler user_id0=%v\n", uint(claims[IdentityKey].(float64)))
		userId := uint(claims[IdentityKey].(float64))

		user, err := repo.GetUser(userId)
		if err != nil {
			e.JSONError(c, e.UserNotFound)
			return nil
		}
		return user
	}
}

func Authenticator() func(c *gin.Context) (any, error) {
	return func(c *gin.Context) (interface{}, error) {
		var loginVals login
		if err := c.ShouldBind(&loginVals); err != nil {
			return "", jwt.ErrMissingLoginValues
		}
		username := loginVals.Username
		password := loginVals.Password

		user, err := repo.AuthUser(username, password)

		if errors.Is(err, gorm.ErrRecordNotFound) {
			return User{}, e.UserNotAuthorized
		}
		if err != nil {
			panic(err)
		}

		return user, nil
	}
}

//func authorizator() func(data interface{}, c *gin.Context) bool {
//	return func(data interface{}, c *gin.Context) bool {
//		//fmt.Printf("authorizator %s\n", data.(*User))
//		//if v, ok := data.(*User); ok && v.Name == "admin" {
//		//	return true
//		//}
//		//return false.
//		return true
//	}
//}

func Unauthorized() func(c *gin.Context, code int, message string) {
	return func(c *gin.Context, code int, message string) {
		c.JSON(code, gin.H{
			"code":    code,
			"message": message,
		})
	}
}
func LoginResponse() func(c *gin.Context, code int, token string, expire time.Time) {
	return func(c *gin.Context, code int, token string, expire time.Time) {
		c.JSON(http.StatusOK, gin.H{
			"code":   http.StatusOK,
			"token":  token,
			"expire": expire.Unix(),
		})
	}
}

func skipLoginAuthentication(authMiddleWare func(c *gin.Context)) func(c *gin.Context) {
	return func(c *gin.Context) {
		path := strings.Trim(c.Request.URL.Path, "/")
		isLogin := strings.HasSuffix(path, "login")
		isRefresh := strings.HasSuffix(path, "refresh_token")
		if isLogin || isRefresh {
			c.Next()
			return
		}
		authMiddleWare(c)
	}
}
