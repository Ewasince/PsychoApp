package commands

import (
	"PsychoBot/stateBot/states"
	. "github.com/Ewasince/go-telegram-state-bot/models"
)

var StartCommand = BotCommand{
	CommandMessage: "start",
	CommandHandler: states.CommandStartHandler,
}
