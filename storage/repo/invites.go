package repo

import (
	. "PsychoApp/storage/models"
	"errors"
	"gorm.io/gorm"
	//"time"
)

func CheckEmail(email string) bool {
	var invite = Invite{}
	err := DB.
		Where("email = ?", email).
		First(&invite).
		Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return false
	}
	if err != nil {
		panic(err)
	}
	return true
}

func AddEmail(email string) {
	var invite = Invite{
		Email:     email,
		BaseModel: BaseModel{},
	}
	err := DB.
		Save(&invite).
		Error

	if err != nil {
		panic(err)
	}
}
func FireEmail(email string) {
	var invite = Invite{}
	err := DB.
		Where("email = ?", email).
		Delete(&invite).
		Error

	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		panic(err)
	}
}
