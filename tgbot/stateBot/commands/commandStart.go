package commands

import (
	"PsychoBot/stateBot/interacts"
	. "PsychoBot/teleBotStateLib"
)

var StartCommand = BotCommand{
	CommandMessage: "start",
	CommandHandler: interacts.InteractStartHandler,
}
