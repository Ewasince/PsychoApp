package states

import . "PsychoBot/teleBotStateLib"

func keyboardEmptyHandler(c BotContext) HandlerResponse {
	return HandlerResponse{}
}

func keyboardBackButtonHandler(c BotContext) HandlerResponse {
	return HandlerResponse{
		NextState:      DefaultState,
		TransitionType: GoStateForce,
	}
}
