package handlers

import (
	"PsychoAppAdmin/errors"
	"PsychoAppAdmin/storage"
	. "PsychoAppAdmin/structures"
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"strconv"
	"time"
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

func GetPatientStoriesHandler(c *gin.Context) {
	// user id
	claims := jwt.ExtractClaims(c)
	userId := UserId(claims[IdentityKey].(float64))

	// patient id
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		panic(err)
	}
	patientId := PatientId(id)

	// check access to patient
	patient, errP := storage.GetPatient(userId, patientId)
	if errP != nil {
		errP.JSONError(c)
		return
	}

	dateStart, errParse := time.Parse(time.RFC3339, c.Query("dateStart"))
	if errParse != nil {
		errors.WrongDateFormat.JSONError(c)
		return
	}
	dateFinish, errParse := time.Parse(time.RFC3339, c.Query("dateFinish"))
	if errParse != nil {
		errors.WrongDateFormat.JSONError(c)
		return
	}

	stories, errS := storage.GetStories(patient.Id, dateStart, dateFinish)
	if errS != nil {
		errS.JSONError(c)
		return
	}

	var JSONStories []gin.H

	for _, story := range stories {
		JSONStories = append(JSONStories, story.ToMap())
	}

	minDate, _ := storage.GetStoryMinDate(patientId)

	var Response = gin.H{
		"stories": JSONStories,
		"minDate": minDate.Format(time.RFC3339),
	}

	c.JSON(200, Response)
}
