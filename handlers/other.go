package handlers

import (
	"PsychoAppAdmin/errors"
	"PsychoAppAdmin/storage"
	. "PsychoAppAdmin/structures"
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
)

func GetMeHandler(c *gin.Context) {
	user, exists := c.Get(IdentityKey)
	if !exists {
		errors.UserNotFound.JSONError(c)
		return
	}
	userStruct := user.(*User)
	c.JSON(200, userStruct.ToMap())
}

func GetPatientsHandler(c *gin.Context) {
	claims := jwt.ExtractClaims(c)

	userId := UserId(claims[IdentityKey].(float64))
	patients, err := storage.GetPatients(userId)

	if err != nil {
		err.JSONError(c)
		return
	}
	var patientsMap []gin.H
	for _, patient := range patients {
		patientsMap = append(patientsMap, patient.ToMap())
	}
	c.JSON(200, patientsMap)
}
