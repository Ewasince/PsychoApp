package storage

import (
	. "StorageModule/models"
)

//var usersCreds = map[string]User{}
//var usersByIds = map[UserId]User{}
//var users = []User{
//	{
//		Id:        10,
//		Username:  "admin",
//		FirstName: "adminFirstName",
//		LastName:  "adminLastName",
//		Password:  "admin",
//	},
//	{
//		Id:        11,
//		Username:  "qwer",
//		FirstName: "qwerFirstName",
//		LastName:  "qwerLastName",
//		Password:  "qwer",
//	},
//}
//
//func init() {
//	// STUB: !!!
//	//prepare users data
//	for _, user := range users {
//		usersCreds[user.Username] = user
//	}
//	for _, user := range users {
//		usersByIds[user.Id] = user
//	}
//}

func AuthUser(email, password string) *User {
	// STUB: !!!

	var user User

	DB.
		Where("Email = ?", email).
		First(&user)

	if &user == nil {
		return nil
	}

	if user.Password != password {
		return nil
	}

	return &user
}

func GetUser(userId uint) *User {
	var user User

	DB.First(&user, userId)

	return &user
}
