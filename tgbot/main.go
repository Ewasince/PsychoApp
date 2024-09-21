package main

import (
	. "EnvironmentModule"
	"PsychoBot/scheduler"
	"PsychoBot/stateBot"
	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"log"
	"time"
)

func main() {
	loc, err := time.LoadLocation("Europe/Moscow")
	if err != nil {
		log.Fatal(err)
	}
	// handle err
	time.Local = loc // -> this is setting the global timezone

	botAPI, err := tg.NewBotAPI(Env.BOT_TOKEN)
	if err != nil {
		log.Fatal(err)
	}

	u := tg.NewUpdate(0)
	u.Timeout = 60

	updates := botAPI.GetUpdatesChan(u)

	// start scheduler
	go scheduler.Start(botAPI)

	for update := range updates {
		if update.Message == nil {
			continue
		}

		messageMessage := update.Message
		messageSender := messageMessage.From

		stateHandler := stateBot.NewStateHandler(
			messageMessage,
			botAPI,
		)

		log.Printf(
			"[%s, %d] %s",
			messageSender.UserName,
			messageSender.ID,
			update.Message.Text,
		)

		if stateHandler.ProcessCommand() {
			continue
		}
		stateHandler.ProcessState()
	}
}
