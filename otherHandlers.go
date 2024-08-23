package main

import (
	"fmt"
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
)

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
