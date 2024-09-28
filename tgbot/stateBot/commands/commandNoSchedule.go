package commands

import (
	"PsychoBot/stateBot/interacts"
	. "PsychoBot/teleBotStateLib"
)

var NoScheduleCommand = BotCommand{
	CommandMessage: "no_schedule",
	CommandHandler: interacts.CommandNoScheduleHandler,
}
