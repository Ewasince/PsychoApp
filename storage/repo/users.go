package repo

import (
	. "StorageModule/models"
	"crypto/rand"
	"errors"
	"fmt"
	"github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"math/big"
)

const (
	SaltLength        = 8
	MaxPasswordLength = 72 - SaltLength
	charset           = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
)

func AuthUser(username, password string) (*User, error) {
	var user User

	if len(password) > MaxPasswordLength {
		return nil, errors.New("Password too long")
	}
	if len(password) == 0 {
		return nil, errors.New("User not authenticated")
	}

	err := DB.
		Where("username = ?", username).
		First(&user).
		Error

	if err != nil {
		return &user, err
	}
	if !CheckPassword(password, user.Salt, user.Password) {
		return nil, errors.New("User not authenticated")
	}

	return &user, nil
}

func CreateUser(
	name,
	username,
	email,
	password string) (*User, error) {

	if len(password) > MaxPasswordLength {
		return nil, errors.New("password too long")
	}
	if len(password) == 0 {
		return nil, errors.New("user not authenticated")
	}

	salt, err := getSalt()
	if err != nil {
		panic(err)
	}
	passwd, err := getPasswordHash(password, salt)
	if err != nil {
		panic(err)
	}

	var user = User{
		BaseModel: BaseModel{},
		Email:     email,
		Username:  username,
		Password:  passwd,
		Salt:      salt,
		Name:      name,
	}

	err = DB.
		Create(&user).
		Error

	if err == nil {
		return &user, nil
	}
	if errors.Is(err, gorm.ErrDuplicatedKey) {
		return nil, errors.New("user already exists")
	} else {
		//goland:noinspection GoTypeAssertionOnErrors,GoDirectComparisonOfErrors
		switch err.(type) {
		case sqlite3.Error:
			var sqliteErr sqlite3.Error
			errors.As(err, &sqliteErr)
			if sqliteErr.Code == sqlite3.ErrConstraint {
				return nil, errors.New("user already exists")
			}
		}
	}
	panic(err)

}

func GetUser(userId uint) (*User, error) {
	var user User

	err := DB.First(&user, userId).Error

	return &user, err
}

func GetUserByUsername(username string) (*User, error) {
	var user User

	err := DB.First(&user, "username = ?", username).Error

	return &user, err
}
func CheckPassword(password, salt, hashedPassword string) bool {
	// Сравниваем хеш с введенным паролем
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password+salt))
	return err == nil
}

func getPasswordHash(password, salt string) (string, error) {
	bytesForHash := []byte(password + salt)
	fmt.Println(bytesForHash)
	hashedPassword, err := bcrypt.GenerateFromPassword(bytesForHash, bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), err
}

func getSalt() (string, error) {
	return randomString(SaltLength)
}

func randomString(length int) (string, error) {
	result := make([]byte, length)
	charsetLength := big.NewInt(int64(len(charset)))

	for i := 0; i < length; i++ {
		index, err := rand.Int(rand.Reader, charsetLength)
		if err != nil {
			return "", err
		}
		result[i] = charset[index.Int64()]
	}

	return string(result), nil
}
