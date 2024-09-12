package handlers

import (
	"PsychoAppAdmin/errors"
	"PsychoAppAdmin/storage"
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"strconv"
	"time"
)

func GetPatientsHandler(c *gin.Context) {
	claims := jwt.ExtractClaims(c)

	userId := claims[IdentityKey].(uint)
	patients := storage.GetPatients(userId)

	if patients == nil {
		errors.UserNotFound.JSONError(c)
		return
	}
	var patientsMap []gin.H
	for _, patient := range *patients {
		patientsMap = append(patientsMap, patient.ToMap())
	}
	c.JSON(200, patientsMap)
}

func GetPatientHandler(c *gin.Context) {
	//// user id
	//claims := jwt.ExtractClaims(c)
	//userId := claims[IdentityKey].(uint)

	// patient id
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		panic(err)
	}
	patientId := uint(id)

	patient := storage.GetPatient(patientId)

	if patient == nil {
		errors.PatientNotFound.JSONError(c)
		return
	}

	c.JSON(200, patient.ToMap())
}

func GetPatientStoriesHandler(c *gin.Context) {
	//// user id
	//claims := jwt.ExtractClaims(c)
	//userId := claims[IdentityKey].(uint)

	// patient id
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		panic(err)
	}
	patientId := uint(id)

	// check access to patient
	patient := storage.GetPatient(patientId)
	if patient == nil {
		errors.PatientNotFound.JSONError(c)
		return
	}

	dateStartQuery := c.Query("dateStart")
	dateFinishQuery := c.Query("dateFinish")

	if dateStartQuery == "" && dateFinishQuery == "" {
		// Just get min date and return
		minDate := storage.GetStoryMinDate(patientId)
		c.JSON(200, gin.H{
			"minDate": minDate.Unix(),
		})
		return
	}

	dateStartTs, err := strconv.Atoi(dateStartQuery)
	if err != nil {
		errors.WrongDateFormat.JSONError(c)
		return
	}
	dateFinishTs, err := strconv.Atoi(dateFinishQuery)
	if err != nil {
		errors.WrongDateFormat.JSONError(c)
		return
	}

	dateStart := time.Unix(int64(dateStartTs), 0)
	dateFinish := time.Unix(int64(dateFinishTs), 0)

	stories := storage.GetStories(patient.UserId, dateStart, dateFinish)

	var JSONStories []gin.H
	for _, story := range *stories {
		JSONStories = append(JSONStories, story.ToMap())
	}

	var Response = gin.H{
		"stories": JSONStories,
	}

	c.JSON(200, Response)
}
