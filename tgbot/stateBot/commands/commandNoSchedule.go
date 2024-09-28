package commands

import (
	"PsychoBot/stateBot/states"
	. "PsychoBot/teleBotStateLib"
)

var NoScheduleCommand = BotCommand{
	CommandMessage: "no_schedule",
	CommandHandler: states.CommandNoScheduleHandler,
}
