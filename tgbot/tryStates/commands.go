package tryStates

import . "PsychoBot/teleBotStateLib"

var startCommand = BotCommand{
	CommandMessage: "start",
	CommandHandler: func(c BotContext) (HandlerResponse, error) {
		ctx := *c.(*MyBotContext)
		if ctx.IsPatientRegistered {
			return HandlerResponse{
				NextState:      &FillStoryState,
				TransitionType: GoState,
			}, nil
		} else {
			return HandlerResponse{
				NextState:      &RegisterState,
				TransitionType: GoState,
			}, nil
		}
	},
}
