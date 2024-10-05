package states

import . "github.com/Ewasince/go-telegram-state-bot"

func keyboardEmptyHandler(c BotContext) HandlerResponse {
	return HandlerResponse{}
}

func keyboardBackButtonHandler(c BotContext) HandlerResponse {
	return HandlerResponse{
		NextState:      DefaultState,
		TransitionType: GoStateForce,
	}
}
