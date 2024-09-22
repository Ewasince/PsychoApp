package bot

import (
	"StorageModule/models"
	"StorageModule/repo"
	"time"
)

func IsPatientRegistered(tgId int64) bool {
	_, patientErr := repo.GetPatientByTg(tgId)
	return patientErr == nil
}

func LoadStory(story *models.Story) error {
	story.Date = getDate()
	return repo.CreateStory(story)
}

func SaveSchedule(patient *models.Patient) error {
	return repo.UpdateSchedule(patient)
}

func getDate() time.Time {
	return time.Now().Truncate(time.Minute)
}
