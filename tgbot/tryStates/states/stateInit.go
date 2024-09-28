package states

import (
	. "PsychoBot/teleBotStateLib"
	"PsychoBot/tryStates"
)

var InitState = newBotStateWrapper(
	"Init state",
	nil,
	nil,
	nil,
	func(c BotContext) (HandlerResponse, error) {
		ctx := *c.(*tryStates.MyBotContext)
		if ctx.IsPatientRegistered() {
			return HandlerResponse{
				NextState:      &FillStoryState,
				TransitionType: GoStateInPlace,
			}, nil
		} else {
			return HandlerResponse{
				NextState:      &RegisterState,
				TransitionType: GoStateInPlace,
			}, nil
		}

	},
)
