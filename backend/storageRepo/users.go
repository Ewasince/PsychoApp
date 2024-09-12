package storageRepo

import (
	"PsychoAppAdmin/errors"
	. "StorageModule/models"
)

func AuthUser(username, password string) (*User, error) {
	// STUB: !!!

	var user User

	err := DB.
		Where("username = ?", username).
		First(&user).
		Error

	if err != nil {
		return &user, err
	}

	if user.Password != password {
		return &User{}, errors.UserNotAuthorized
	}

	return &user, nil
}

func GetUser(userId uint) (*User, error) {
	var user User

	err := DB.First(&user, userId).Error

	return &user, err
}
