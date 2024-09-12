package storageRepo

import (
	. "StorageModule/models"
)

func GetPatients(userId uint) (*[]Patient, error) {
	var patients []Patient
	err := DB.Where("UserId = ?", userId).Find(&patients).Error

	return &patients, err
}

func GetPatient(patientId uint) (*Patient, error) {
	// STUB: !!!
	var patient Patient
	err := DB.Find(&patient, patientId).Error

	return &patient, err
}