package repo

import (
	. "StorageModule/models"
	"crypto/rand"
	"fmt"
	"github.com/pkg/errors"
	"golang.org/x/crypto/bcrypt"
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
