package storageRepo

import (
	. "StorageModule/models"
	"time"
)

func GetStories(patientId uint, dateStart, dateFinish time.Time) (*[]Story, error) {
	// STUB: !!!
	var stories = make([]Story, 0)
	err := DB.
		Where("PatientId = ?", patientId).
		Where("Date >= ?", dateStart).
		Where("Date < ?", dateFinish).
		Find(&stories).
		Error

	return &stories, err
}

func GetStoryMinDate(patientId uint) (time.Time, error) {
	var story Story

	err := DB.
		Where("PatientId = ?", patientId).
		Order("Date asc").
		First(&story).
		Error

	return story.Date, err
}
