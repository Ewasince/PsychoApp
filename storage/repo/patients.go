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
	err := DB.Find(&patient, patientId).Error

	return &patient, err
}
