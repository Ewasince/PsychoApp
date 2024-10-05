package commands

import (
	"PsychoBot/stateBot/states"
	. "github.com/Ewasince/go-telegram-state-bot"
)

var NoScheduleCommand = BotCommand{
	CommandMessage: "no_schedule",
	CommandHandler: states.CommandNoScheduleHandler,
}
