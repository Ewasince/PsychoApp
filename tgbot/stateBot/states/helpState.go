package states

import (
	msg "PsychoBot/messages"
	. "github.com/Ewasince/go-telegram-state-bot"
)

var HelpState = NewBotState(
	"Help state",
	BotMessages{msg.StartHelp},
	nil,
	&HelpKeyboard,
	nil,
)
