package commands

import (
	"PsychoBot/stateBot/interacts"
	. "PsychoBot/teleBotStateLib"
)

var ScheduleCommand = BotCommand{
	CommandMessage: "schedule",
	CommandHandler: interacts.InteractScheduleHandler,
}
