package scheduler

import (
	"PsychoApp/logger"
	. "PsychoApp/storage/models"
	"PsychoApp/storage/repo"
	msg "PsychoApp/tgbot/messages"
	. "github.com/Ewasince/go-telegram-state-bot/api_utils"
	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/madflojo/tasks"
	"time"
)

const CHECK_INTERVAL = time.Hour

var sendHandler *BaseSenderHandler

func Start(apiHandler *BaseSenderHandler) {
	sendHandler = apiHandler
	// Start the Scheduler
	scheduler := tasks.New()
	defer scheduler.Stop()

	logger.Log.Printf("Local zone = %s\n", time.Local)

	startAfter := time.Now().Add(time.Hour).Truncate(time.Hour)

	// Add a task
	_, err := scheduler.Add(&tasks.Task{
		Interval:   CHECK_INTERVAL,
		StartAfter: startAfter,
		TaskFunc:   HandleScheduledNotifications,
	})
	if err != nil {
		logger.Log.Println("Cant start scheduler ", err)
		panic(err)
	}
	logger.Log.Printf("Scheduler will start after %s\n", startAfter)
	select {} // Блокирует выполнение, позволяя задаче продолжать работу
}

func HandleScheduledNotifications() error {
	now := time.Now().Truncate(time.Millisecond)
	logger.Log.Printf("Scheduler started at %s\n", now)

	patients, err := repo.GetScheduledPatients()
	var patientsUpdate []*Patient

	if err != nil {
		logger.Log.Fatal("Cant get scheduled users: " + err.Error())
		return err
	}
	for _, patient := range patients {
		if now.Before(*patient.NextSchedule) {
			logger.Log.Printf("skip with time %s\n", *patient.NextSchedule)
			continue
		}
		err := sendNotification(patient)
		if err != nil {
			continue
		}
		NextSchedule := patient.NextSchedule.Add(time.Hour * 24)
		patient.NextSchedule = &NextSchedule
		patientsUpdate = append(patientsUpdate, patient)
	}

	if len(patientsUpdate) == 0 {
		logger.Log.Println("No patients were handled")
		return nil
	}

	err = repo.UpdateSchedules(patientsUpdate)
	if err != nil {
		logger.Log.Fatal("Cant update scheduled users: " + err.Error())
		return nil
	}
	return nil
}

func sendNotification(patient *Patient) error {
	message := tg.NewMessage(*patient.TgChatId, msg.ScheduleNotification)
	return sendHandler.SendChattable(message)
}
