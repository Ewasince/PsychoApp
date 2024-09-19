package scheduler

import (
	. "StorageModule/models"
	"StorageModule/repo"
	"github.com/madflojo/tasks"
	"log"
	"time"
)

func Start() {
	// Start the Scheduler
	scheduler := tasks.New()
	defer scheduler.Stop()

	// Add a task
	_, err := scheduler.Add(&tasks.Task{
		Interval:   5 * time.Second,
		StartAfter: time.Now().Add(time.Hour).Truncate(time.Minute),
		TaskFunc:   HandleScheduledNotifications,
	})
	if err != nil {
		log.Println("Cant start scheduler ", err)
		panic(err)
	}
	log.Println("Scheduler started..")
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
		if now.Before(patient.NextSchedule) {
			continue
		}
		err := sendNotification(patient)
		if err != nil {
			continue
		}
		NextSchedule := patient.NextSchedule.Add(time.Hour * 24)
		patient.NextSchedule = NextSchedule
		patientsUpdate = append(patientsUpdate, patient)
	}

	if len(patientsUpdate) == 0 {
		log.Println("No patients were handled")
		return nil
	}

	err = repo.UpdateSchedules(patientsUpdate)
	if err != nil {
		log.Fatal("Cant update scheduled users: " + err.Error())
		return err
	}
	return nil
}

func sendNotification(patient *Patient) error {
	return nil
}
