package commands

import (
	"PsychoApp/tgbot/stateBot/states"
	. "github.com/Ewasince/go-telegram-state-bot/models"
)

var StartCommand = BotCommand{
	CommandMessage: "start",
	CommandHandler: states.CommandStartHandler,
}
