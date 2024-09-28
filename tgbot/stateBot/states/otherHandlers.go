package states

import . "PsychoBot/teleBotStateLib"

func keyboardEmptyHandler(c BotContext) (HandlerResponse, error) {
	return HandlerResponse{}, nil
}

func keyboardBackButtonHandler(c BotContext) (HandlerResponse, error) {
	return HandlerResponse{
		NextState:      DefaultState,
		TransitionType: GoStateForce,
	}, nil
}
