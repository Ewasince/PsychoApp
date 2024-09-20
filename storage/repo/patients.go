package repo

import (
	. "StorageModule/models"
)

func GetPatients(userId uint) (*[]Patient, error) {
	var patients []Patient
	err := DB.Where("user_id = ?", userId).Find(&patients).Error

	return &patients, err
}

func GetPatient(patientId uint) (*Patient, error) {
	var patient Patient
	err := DB.First(&patient, patientId).Error

	return &patient, err
}

func GetPatientByTg(tgId int64) (*Patient, error) {
	var patient Patient
	err := DB.First(&patient, "tg_id = ?", tgId).Error

	return &patient, err
}

func CreatePatient(patient *Patient) error {
	err := DB.Create(&patient).Error

	return err
}

func GetScheduledPatients() ([]*Patient, error) {
	var patients []*Patient
	err := DB.
		Where("next_schedule IS NOT NULL").
		Find(&patients).Error

	return patients, err
}

func UpdateSchedules(patients []*Patient) error {
	for _, patient := range patients {
		err := UpdateSchedule(patient)
		if err != nil {
			return err
		}
	}

	return nil
}

func UpdateSchedule(patient *Patient) error {
	err := DB.
		Model(&Patient{}).
		Where("id = ?", patient.ID).
		Select("next_schedule", "tg_chat_id").
		Updates(&Patient{
			NextSchedule: patient.NextSchedule,
			TgChatId:     patient.TgChatId,
		}).
		Error

	return err
}
