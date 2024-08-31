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

	dateStartQuery := c.Query("dateStart")
	dateFinishQuery := c.Query("dateFinish")

	if dateStartQuery == "" && dateFinishQuery == "" {
		// Just get min date and return
		minDate, _ := storage.GetStoryMinDate(patientId)
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

	stories, errS := storage.GetStories(patient.Id, dateStart, dateFinish)
	if errS != nil {
		errS.JSONError(c)
		return
	}

	var JSONStories []gin.H
	for _, story := range stories {
		JSONStories = append(JSONStories, story.ToMap())
	}

	var Response = gin.H{
		"stories": JSONStories,
	}

	c.JSON(200, Response)
}
