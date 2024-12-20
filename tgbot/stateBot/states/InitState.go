package states

import (
	"PsychoApp/tgbot/stateBot/context"

	. "github.com/Ewasince/go-telegram-state-bot/enums"
	. "github.com/Ewasince/go-telegram-state-bot/interfaces"
	. "github.com/Ewasince/go-telegram-state-bot/states"
)

var InitState = NewBotState(
	"Init state",
	nil,
	nil,
	nil,
	func(c BotContext) HandlerResponse {
		ctx := *c.(*context.MyBotContext)
		if ctx.IsPatientRegistered() {
			return HandlerResponse{
				NextState:      DefaultState,
				TransitionType: GoStateInPlace,
			}
		} else {
			return HandlerResponse{
				NextState:      &RegisterState,
				TransitionType: GoStateInPlace,
			}
		}

	},
)
