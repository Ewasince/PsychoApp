package states

import (
	msg "PsychoBot/messages"
	. "github.com/Ewasince/go-telegram-state-bot/message_types"

	. "github.com/Ewasince/go-telegram-state-bot/states"
)

var HelpState = NewBotState(
	"Help state",
	TextMessage(msg.StartHelp),
	nil,
	&HelpKeyboard,
	nil,
)
