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
