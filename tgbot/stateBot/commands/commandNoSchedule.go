package commands

import (
	"PsychoApp/tgbot/stateBot/states"
	. "github.com/Ewasince/go-telegram-state-bot/models"
)

var NoScheduleCommand = BotCommand{
	CommandMessage: "no_schedule",
	CommandHandler: states.CommandNoScheduleHandler,
}
