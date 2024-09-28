package commands

import (
	"PsychoBot/stateBot/states"
	. "PsychoBot/teleBotStateLib"
)

var StartCommand = BotCommand{
	CommandMessage: "start",
	CommandHandler: states.CommandStartHandler,
}
