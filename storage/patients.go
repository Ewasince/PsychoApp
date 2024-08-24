package storage

import (
	"PsychoAppAdmin/errors"
	. "PsychoAppAdmin/structures"
)

var patientsByUser = map[UserId][]Patient{
	10: {
		{Id: 20, FirstName: "John", LastName: "Doe"},
		{Id: 21, FirstName: "Alice", LastName: "Johnson"},
	},
	11: {
		{Id: 22, FirstName: "Jane", LastName: "Smith"},
	},
	12: {
		{Id: 23, FirstName: "Emily", LastName: "Brown"},
		{Id: 24, FirstName: "Michael", LastName: "White"},
	},
}

var patientsByUserById = map[UserId]map[PatientId]Patient{}

func init() {
	for userId, patients := range patientsByUser {
		patientsMap := map[PatientId]Patient{}
		patientsByUserById[userId] = patientsMap
		for _, patient := range patients {
			patientsMap[patient.Id] = patient
		}
	}
}

func GetPatients(userId UserId) ([]Patient, errors.IWebError) {
	// STUB: !!!
	patients, found := patientsByUser[userId]

	if !found {
		return nil, errors.UserNotFound
	}

	return patients, nil
}

func GetPatient(userId UserId, patientId PatientId) (*Patient, errors.IWebError) {
	// STUB: !!!

	patientsById, foundU := patientsByUserById[userId]
	if !foundU {
		return nil, errors.UserNotFound
	}

	patient, foundP := patientsById[patientId]
	if !foundP {
		return nil, errors.PatientNotFound
	}

	return &patient, nil
}
