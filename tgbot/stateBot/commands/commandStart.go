package commands

import (
	"PsychoBot/stateBot/context"
	"PsychoBot/stateBot/states"
	. "PsychoBot/teleBotStateLib"
)

var StartCommand = BotCommand{
	CommandMessage: "start",
	CommandHandler: func(c BotContext) (HandlerResponse, error) {
		ctx := *c.(*context.MyBotContext)

		if !ctx.IsPatientRegistered() {
			return HandlerResponse{
				NextState:      &states.RegisterState,
				TransitionType: GoState,
			}, nil
		}

		return HandlerResponse{
			NextState:      &states.FillStoryState,
			TransitionType: GoState,
		}, nil
	},
}
