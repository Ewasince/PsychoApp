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

func addBackButton(rows *[]ButtonsRow) {
	*rows = append(*rows, ButtonsRow{
		BotButton{
			ButtonTitle:   "Новая запись",
			ButtonHandler: keyboardBackButtonHandler,
		},
	})
}
func addBackButtonWithHandler(rows *[]ButtonsRow, handler ContextHandler) {
	*rows = append(*rows, ButtonsRow{
		BotButton{
			ButtonTitle:   "Назад",
			ButtonHandler: handler,
		},
	})
}
