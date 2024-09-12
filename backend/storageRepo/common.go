package storageRepo

import (
	. "EnvironmentModule"
	st "StorageModule"
	"StorageModule/models"
	"fmt"
	"gorm.io/gorm"
	"time"
)

var DB *gorm.DB

func init() {
	DB = st.GetSQLiteDB().Session(&gorm.Session{CreateBatchSize: 1000})

	if Env.DEBUG {
		var count int64

		DB.Find(&models.User{}).Count(&count)
		if count == 0 {
			fillDatabase()
		}
	}

}

func fillDatabase() {
	fmt.Println("fill database!")
	DB.Exec("DELETE FROM users")
	DB.Exec("DELETE FROM patients")
	DB.Exec("DELETE FROM stories")

	users := createUsers()
	patients := createPatients(getFirstKey(users))
	createStories(getFirstKey(patients))
}

func createUsers() map[uint]*models.User {
	var usersByIds map[uint]*models.User = make(map[uint]*models.User)

	var users = []*models.User{
		{
			Name:     "admin",
			Email:    "admin@example.com",
			Password: "admin",
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
		{
			Name:     "qwer",
			Email:    "qwer@example.com",
			Password: "qwer",
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
	}
	DB.Create(&users)

	for _, user := range users {
		usersByIds[user.ID] = user
		fmt.Printf("user: %v\n", user)
	}
	return usersByIds
}

func createPatients(userId uint) map[uint]*models.Patient {
	var patientsByIds map[uint]*models.Patient = make(map[uint]*models.Patient)

	var patients = []*models.Patient{
		{
			Name:     "patient",
			Email:    "admin@example.com",
			Password: "admin",
			UserId:   userId,
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
		{
			Name:     "qwer",
			Email:    "qwer@example.com",
			Password: "qwer",
			UserId:   userId,
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
	}
	DB.Create(&patients)

	for _, patient := range patients {
		patientsByIds[patient.ID] = patient
		fmt.Printf("patient: %v\n", patient)
	}
	return patientsByIds
}
func createStories(patientId uint) map[uint]*models.Story {
	var storiesByIds map[uint]*models.Story = make(map[uint]*models.Story)

	var stories = []*models.Story{
		{

			Date:      truncateToDay(time.Now(), 0),
			Situation: "Обосрался",
			Mind:      "Я еблан",
			Emotion:   "Грусть",
			Power:     7,
			PatientId: patientId,
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
		{

			Date:      truncateToDay(time.Now(), 1),
			Situation: "Сказали что скуф",
			Mind:      "Где альтушка?",
			Emotion:   "Печаль",
			Power:     8,
			PatientId: patientId,
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
		{

			Date:      truncateToDay(time.Now(), 2),
			Situation: "Колени хрустят, кружится спина",
			Mind:      "Таблеток бы...",
			Emotion:   "Задумчивость",
			Power:     4,
			PatientId: patientId,
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
	}
	DB.Create(&stories)

	for _, patient := range stories {
		storiesByIds[patient.ID] = patient
		fmt.Printf("patient: %v\n", patient)
	}
	return storiesByIds
}

func getFirstKey[T comparable, V any](m map[T]V) T {
	for k := range m {
		return k
	}
	panic("Empty map")
}
func truncateToDay(t time.Time, daysBackward int) time.Time {
	return time.
		Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, t.Location()).
		AddDate(0, 0, daysBackward)
}
