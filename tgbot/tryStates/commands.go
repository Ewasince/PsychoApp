package tryStates

import . "PsychoBot/teleBotStateLib"

var startCommand = BotCommand{
	CommandMessage: "start",
	CommandHandler: func(c BotContext) (HandlerResponse, error) {
		ctx := *c.(*MyBotContext)
		if ctx.IsPatientRegistered {
			return HandlerResponse{
				NextStateId:    BotStateFillStory,
				TransitionType: GoState,
			}, nil
		} else {
			return HandlerResponse{
				NextStateId:    BotStateRegister,
				TransitionType: GoState,
			}, nil
		}
	},
}
