package bot

import (
	"StorageModule/models"
	"StorageModule/repo"
)

func IsPatientRegistered(tgId int64) bool {
	_, patientErr := repo.GetPatientByTg(tgId)
	return patientErr == nil
}

func LoadStory(story *models.Story) error {
	return repo.CreateStory(story)
}

func SaveSchedule(patient *models.Patient) error {
	return repo.UpdateSchedule(patient)
}
