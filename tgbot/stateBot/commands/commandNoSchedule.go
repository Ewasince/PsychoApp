package commands

import (
	"PsychoBot/stateBot/states"
	. "github.com/Ewasince/go-telegram-state-bot/models"
)

var NoScheduleCommand = BotCommand{
	CommandMessage: "no_schedule",
	CommandHandler: states.CommandNoScheduleHandler,
}
