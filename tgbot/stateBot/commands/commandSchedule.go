package commands

import (
	"PsychoBot/stateBot/states"
	. "github.com/Ewasince/go-telegram-state-bot/models"
)

var ScheduleCommand = BotCommand{
	CommandMessage: "schedule",
	CommandHandler: states.CommandScheduleHandler,
}
