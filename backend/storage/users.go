package storage

import (
	"PsychoAppAdmin/errors"
	. "PsychoAppAdmin/structures"
	jwt "github.com/appleboy/gin-jwt/v2"
)

var usersCreds = map[string]User{}
var usersByIds = map[UserId]User{}
var users = []User{
	{
		Id:        10,
		Username:  "admin",
		FirstName: "adminFirstName",
		LastName:  "adminLastName",
		Password:  "admin",
	},
	{
		Id:        11,
		Username:  "qwer",
		FirstName: "qwerFirstName",
		LastName:  "qwerLastName",
		Password:  "qwer",
	},
}

func init() {
	// STUB: !!!
	//prepare users data
	for _, user := range users {
		usersCreds[user.Username] = user
	}
	for _, user := range users {
		usersByIds[user.Id] = user
	}
}

func AuthUser(username string, password string) (*User, error) {
	// STUB: !!!

	user, ok := usersCreds[username]

	if !ok {
		return nil, jwt.ErrFailedAuthentication
	}

	if user.Password != password {
		return nil, jwt.ErrFailedAuthentication
	}

	return &user, nil
}

func GetUser(userId UserId) (*User, error) {
	user, found := usersByIds[userId]
	if !found {
		return nil, errors.UserNotFound
	}
	return &user, nil
}
