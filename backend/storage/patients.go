package storage

import (
	. "StorageModule/models"
)

//var patientsByUser = map[UserId][]Patient{
//	10: {
//		{Id: 20, FirstName: "John", LastName: "Doe"},
//		{Id: 21, FirstName: "Alice", LastName: "Johnson"},
//	},
//	11: {
//		{Id: 22, FirstName: "Jane", LastName: "Smith"},
//	},
//	12: {
//		{Id: 23, FirstName: "Emily", LastName: "Brown"},
//		{Id: 24, FirstName: "Michael", LastName: "White"},
//	},
//}
//
//var patientsByUserById = map[UserId]map[PatientId]Patient{}
//
//func init() {
//	// STUB: !!!
//	for userId, patients := range patientsByUser {
//		patientsMap := map[PatientId]Patient{}
//		patientsByUserById[userId] = patientsMap
//		for _, patient := range patients {
//			patientsMap[patient.Id] = patient
//		}
//	}
//}

func GetPatients(userId uint) *[]Patient {
	var patients []Patient
	DB.Where("UserId = ?", userId).Find(&patients)

	return &patients
}

func GetPatient(patientId uint) *Patient {
	// STUB: !!!
	var patient Patient
	DB.Find(&patient, patientId)

	return &patient
}
