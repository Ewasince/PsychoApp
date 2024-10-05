package states

import (
	"PsychoBot/stateBot/context"
	. "github.com/Ewasince/go-telegram-state-bot"
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
