package repo

import (
	. "StorageModule/models"
	"time"
)

type dateForMood time.Time

func GetMoods(patientId uint, dateStart, dateFinish time.Time) (*[]Mood, error) {
	var moods = make([]Mood, 0)
	err := DB.
		Where("patient_id = ?", patientId).
		Where("date >= ?", dateStart).
		Where("date < ?", dateFinish).
		Order("date desc").
		Find(&moods).
		Error

	return &moods, err
}

func GetMoodMinDate(patientId uint) (time.Time, error) {
	var mood Mood

	err := DB.
		Where("patient_id = ?", patientId).
		Order("date asc").
		First(&mood).
		Error

	return mood.Date, err
}

func GetMood(patientId uint, date time.Time) (*Mood, error) {
	var mood Mood
	moodDate := getDateForMood(date)
	err := DB.
		Where("patient_id = ?", patientId).
		Where("date = ?", moodDate).
		First(&mood).
		Error

	return &mood, err
}

func SetMood(patientId uint, date time.Time, value int8) error {
	castedDate := getDateForMood(date)

	newMood := Mood{}

	err := DB.
		Where("patient_id = ?", patientId).
		Where("date = ?", castedDate).
		First(&newMood).
		Error
	if err != nil {
		return err
	}
	newMood.Value = value
	newMood.Date = castedDate
	newMood.PatientId = patientId

	err = DB.Save(&newMood).Error
	return err
}

func getDateForMood(date time.Time) time.Time {
	cd := date.Add(-3 * time.Hour) // allow to set mood for yesterday when early AM
	moodDate := time.Date(cd.Year(), cd.Month(), cd.Day(), 0, 0, 0, 0, time.Local)
	return moodDate
}
