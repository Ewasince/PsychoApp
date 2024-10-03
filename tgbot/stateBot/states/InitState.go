package states

import (
	"PsychoBot/stateBot/context"
	. "PsychoBot/teleBotStateLib"
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
				NextState:      &FillStoryState,
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
