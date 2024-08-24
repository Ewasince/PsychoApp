package handlers

import (
	"PsychoAppAdmin/storage"
	. "PsychoAppAdmin/structures"
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"strconv"
)

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

func GetPatientHandler(c *gin.Context) {
	// user id
	claims := jwt.ExtractClaims(c)
	userId := UserId(claims[IdentityKey].(float64))

	// patient id
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		panic(err)
	}
	patientId := PatientId(id)

	patient, errP := storage.GetPatient(userId, patientId)

	if errP != nil {
		errP.JSONError(c)
		return
	}

	c.JSON(200, patient.ToMap())
}
