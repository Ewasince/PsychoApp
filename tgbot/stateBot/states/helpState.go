package states

import (
	img "PsychoBot/images"
	msg "PsychoBot/messages"
	. "github.com/Ewasince/go-telegram-state-bot/message_types"

	. "github.com/Ewasince/go-telegram-state-bot/states"
)

var HelpState = NewBotState(
	"Help state",
	BotMessages{img.HelpImage, TextMessage(msg.StartHelp)},
	nil,
	&HelpKeyboard,
	nil,
)
