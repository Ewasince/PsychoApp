package handlers

import (
	e "PsychoAppAdmin/errors"
	"StorageModule/repo"
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"strconv"
	"time"
)

var loc *time.Location

func init() {
	// Загрузка временной зоны (например, Europe/Moscow)
	var err error
	loc, err = time.LoadLocation("Europe/Moscow")
	if err != nil {
		panic(err)
	}
}

// GetPatientsHandler return patients list for user, which request
func GetPatientsHandler(c *gin.Context) {
	claims := jwt.ExtractClaims(c)

	userId := uint(claims[IdentityKey].(float64))
	patients, err := repo.GetPatients(userId)

	if err != nil {
		e.JSONError(c, e.UserNotFound)
		return
	}
	var patientsMap = make([]gin.H, 0)
	for _, patient := range *patients {
		patientsMap = append(patientsMap, patient.ToMap())
	}
	c.JSON(200, patientsMap)
}

// GetPatientHandler return data about selected patient, which belongs to user
func GetPatientHandler(c *gin.Context) {
	// patient id
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		panic(err)
	}
	patientId := uint(id)

	patient, err := repo.GetPatient(patientId)

	if err != nil {
		e.JSONError(c, e.PatientNotFound)
		return
	}

	// check access to patient
	claims := jwt.ExtractClaims(c)
	userId := uint(claims[IdentityKey].(float64))
	if patient.UserId != userId {
		e.JSONError(c, e.AccessForbidden)
		return
	}

	c.JSON(200, patient.ToMap())
}

// GetPatientStoriesHandler return stories of selected patient, which belongs to user
func GetPatientStoriesHandler(c *gin.Context) {
	// user id
	claims := jwt.ExtractClaims(c)
	userId := uint(claims[IdentityKey].(float64))

	// patient id
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		panic(err)
	}
	patientId := uint(id)

	// check access to patient
	patient, err := repo.GetPatient(patientId)
	if err != nil {
		e.JSONError(c, e.PatientNotFound)
		return
	}
	if patient.UserId != userId {
		e.JSONError(c, e.AccessForbidden)
		return
	}

	dateStartQuery := c.Query("dateStart")
	dateFinishQuery := c.Query("dateFinish")

	if dateStartQuery == "" && dateFinishQuery == "" {
		// Just get min date and return
		minDate, err := repo.GetStoryMinDate(patientId)
		if err != nil {
			c.JSON(200, gin.H{
				"minDate": time.Now().Unix(),
			})
		} else {
			c.JSON(200, gin.H{
				"minDate": minDate.Unix(),
			})
		}
		return
	}

	dateStartTs, err := strconv.Atoi(dateStartQuery)
	if err != nil {
		e.JSONError(c, e.WrongDateFormat)
		return
	}
	dateFinishTs, err := strconv.Atoi(dateFinishQuery)
	if err != nil {
		e.JSONError(c, e.WrongDateFormat)
		return
	}

	dateStart := time.Unix(int64(dateStartTs), 0).In(loc)
	dateFinish := time.Unix(int64(dateFinishTs), 0).In(loc)

	stories, err := repo.GetStories(patientId, dateStart, dateFinish)

	var JSONStories = make([]gin.H, 0)
	for _, story := range *stories {
		JSONStories = append(JSONStories, story.ToMap())
	}

	var Response = gin.H{
		"stories": JSONStories,
	}

	c.JSON(200, Response)
}
