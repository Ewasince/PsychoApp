package commands

import (
	"PsychoBot/stateBot/states"
	. "PsychoBot/teleBotStateLib"
)

var ScheduleCommand = BotCommand{
	CommandMessage: "schedule",
	CommandHandler: states.CommandScheduleHandler,
}
