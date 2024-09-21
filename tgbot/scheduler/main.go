package scheduler

import (
	"PsychoBot/bot"
	msg "PsychoBot/messages"
	. "StorageModule/models"
	"StorageModule/repo"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/madflojo/tasks"
	"log"
	"time"
)

const CHECK_INTERVAL = time.Hour

var botApi *tgbotapi.BotAPI

func Start(api *tgbotapi.BotAPI) {
	botApi = api
	// Start the Scheduler
	scheduler := tasks.New()
	defer scheduler.Stop()

	log.Printf("Local zone = %s\n", time.Local)

	startAfter := time.Now().Add(time.Hour).Truncate(time.Hour)

	// Add a task
	_, err := scheduler.Add(&tasks.Task{
		Interval:   CHECK_INTERVAL,
		StartAfter: startAfter,
		TaskFunc:   HandleScheduledNotifications,
	})
	if err != nil {
		log.Println("Cant start scheduler ", err)
		panic(err)
	}
	log.Printf("Scheduler will start after %s\n", startAfter)
	select {} // Блокирует выполнение, позволяя задаче продолжать работу
}

func HandleScheduledNotifications() error {
	now := time.Now().Truncate(time.Millisecond)
	log.Printf("Scheduler started at %s\n", now)

	patients, err := repo.GetScheduledPatients()
	var patientsUpdate []*Patient

	if err != nil {
		log.Fatal("Cant get scheduled users: " + err.Error())
		return err
	}
	for _, patient := range patients {
		if now.Before(*patient.NextSchedule) {
			log.Printf("skip with time %s\n", *patient.NextSchedule)
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
		log.Println("No patients were handled")
		return nil
	}

	err = repo.UpdateSchedules(patientsUpdate)
	if err != nil {
		log.Fatal("Cant update scheduled users: " + err.Error())
		return nil
	}
	return nil
}

func sendNotification(patient *Patient) error {
	handler := bot.Handler{
		BotApi:        botApi,
		MessageChatId: *patient.TgChatId,
	}
	return handler.CreateAndSendMessage(msg.ScheduleNotification)
}
