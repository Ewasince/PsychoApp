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

func GetPatients(userId UserId) ([]Patient, errors.IWebError) {
	// STUB: !!!
	patients, found := patientsByUser[userId]

	if !found {
		return nil, errors.UserNotFound
	}

	return patients, nil
}
