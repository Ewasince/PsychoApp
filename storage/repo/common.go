package repo

import (
	. "PsychoApp/environment"
	st "PsychoApp/storage"
	"PsychoApp/storage/models"
	"fmt"
	"gorm.io/gorm"
	"time"
)

var DB *gorm.DB

func init() {
	DB = st.GetSQLiteDB().Session(&gorm.Session{CreateBatchSize: 1000})

	if Env.DEV {
		fillDatabase()
	}

}

func fillDatabase() {
	tx := DB.Begin()
	fmt.Println("fill database!")
	tx.Exec("DELETE FROM users")
	tx.Exec("DELETE FROM patients")
	tx.Exec("DELETE FROM stories")

	users := createUsers(tx)
	patients := createPatients(tx, getFirstKey(users))
	createStories(tx, getFirstKey(patients))
	tx.Commit()
}

func createUsers(tx *gorm.DB) map[uint]*models.User {
	var usersByIds = make(map[uint]*models.User)

	var users = []*models.User{
		{
			Name:     "admin",
			Email:    "admin@example.com",
			Username: "admin",
			Password: "$2a$10$x4ukaIiCuP9APhvBGmxBxOWr3yIdCENyH4/e3Ny0cuBR1X2/ID7x.",
			Salt:     "Iv398Js9",
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
		{
			Name:     "qwer",
			Email:    "qwer@example.com",
			Username: "qwer",
			Password: "$2a$10$x4ukaIiCuP9APhvBGmxBxOWr3yIdCENyH4/e3Ny0cuBR1X2/ID7x.",
			Salt:     "Iv398Js9",
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
	}
	tx.Create(&users)

	for _, user := range users {
		usersByIds[user.ID] = user
		fmt.Printf("user: %v\n", user)
	}
	return usersByIds
}

func createPatients(tx *gorm.DB, userId uint) map[uint]*models.Patient {
	var patientsByIds = make(map[uint]*models.Patient)

	var patients = []*models.Patient{
		{
			Name:     "patient",
			Email:    "admin@example.com",
			Username: "patient",
			Password: "patient",
			UserId:   userId,
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
		{
			Name:     "patient_qwer",
			Email:    "qwer@example.com",
			Username: "patient_qwer",
			Password: "patient_qwer",
			UserId:   userId,
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
	}
	tx.Create(&patients)

	for _, patient := range patients {
		patientsByIds[patient.ID] = patient
		fmt.Printf("patient: %v\n", patient)
	}
	return patientsByIds
}
func createStories(tx *gorm.DB, patientId uint) map[uint]*models.Story {
	var storiesByIds = make(map[uint]*models.Story)

	var stories = []*models.Story{
		{

			Date:      truncateToDay(time.Now(), 0),
			Situation: "Уронил мороженое",
			Mind:      "Вот дурак",
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
		{
			Date:      truncateToDay(time.Now(), 3),
			Situation: "Колени хрустят, кружится спина",
			Mind:      "Таблеток бы...",
			Emotion:   "Задумчивость",
			Power:     4,
			PatientId: patientId,
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
		{
			Date:      truncateToDay(time.Now(), 4),
			Situation: "Болит голова, глаза режет",
			Mind:      "Может прилечь на часок",
			Emotion:   "Раздражение",
			Power:     3,
			PatientId: patientId,
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
		{
			Date:      truncateToDay(time.Now(), 5),
			Situation: "Тянет шею, сложно двигаться",
			Mind:      "Надо бы массаж сделать",
			Emotion:   "Усталость",
			Power:     2,
			PatientId: patientId,
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
		{
			Date:      truncateToDay(time.Now(), 6),
			Situation: "Затекла рука, не чувствую пальцы",
			Mind:      "Где мой крем?",
			Emotion:   "Тревога",
			Power:     3,
			PatientId: patientId,
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
		{
			Date:      truncateToDay(time.Now(), 7),
			Situation: "Ноги как ватные, шатаюсь",
			Mind:      "Дойти бы до дома...",
			Emotion:   "Беспокойство",
			Power:     2,
			PatientId: patientId,
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
		{
			Date:      truncateToDay(time.Now(), 8),
			Situation: "Спина болит при движении",
			Mind:      "Нужно больше растягиваться",
			Emotion:   "Недовольство",
			Power:     3,
			PatientId: patientId,
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
		{
			Date:      truncateToDay(time.Now(), 9),
			Situation: "Ломота в суставах",
			Mind:      "Завтра к врачу",
			Emotion:   "Неуверенность",
			Power:     1,
			PatientId: patientId,
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
		{
			Date:      truncateToDay(time.Now(), 10),
			Situation: "Головокружение, всё плывет",
			Mind:      "Нужно больше пить воды",
			Emotion:   "Замешательство",
			Power:     3,
			PatientId: patientId,
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
		{
			Date:      truncateToDay(time.Now(), 11),
			Situation: "Ощущение тяжести в ногах",
			Mind:      "Пора бы размяться",
			Emotion:   "Фрустрация",
			Power:     4,
			PatientId: patientId,
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
		{
			Date:      truncateToDay(time.Now(), 12),
			Situation: "Немеют пальцы, сложно двигать",
			Mind:      "Опять руки...",
			Emotion:   "Огорчение",
			Power:     2,
			PatientId: patientId,
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
		{
			Date:      truncateToDay(time.Now(), 13),
			Situation: "Слабость в руках, тяжело поднимать",
			Mind:      "Где мои силы?",
			Emotion:   "Печаль",
			Power:     1,
			PatientId: patientId,
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
		{
			Date:      truncateToDay(time.Now(), 14),
			Situation: "Шея затекла, тяжело двигать",
			Mind:      "Надо больше разминаться",
			Emotion:   "Неприятие",
			Power:     3,
			PatientId: patientId,
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
		{
			Date:      truncateToDay(time.Now(), 15),
			Situation: "Хруст в коленях при движении",
			Mind:      "Пора на обследование",
			Emotion:   "Задумчивость",
			Power:     4,
			PatientId: patientId,
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
		{
			Date:      truncateToDay(time.Now(), 16),
			Situation: "Слабость в ногах, тяжело ходить",
			Mind:      "Нужно больше двигаться",
			Emotion:   "Разочарование",
			Power:     2,
			PatientId: patientId,
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
		{
			Date:      truncateToDay(time.Now(), 17),
			Situation: "Чувство усталости, трудно сосредоточиться",
			Mind:      "Нужен отдых",
			Emotion:   "Невыразительность",
			Power:     1,
			PatientId: patientId,
			BaseModel: models.BaseModel{
				Model: gorm.Model{},
			},
		},
	}
	tx.Create(&stories)

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
		AddDate(0, 0, -daysBackward)
}
