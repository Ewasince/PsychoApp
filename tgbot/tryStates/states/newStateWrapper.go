package states

import (
	. "PsychoBot/teleBotStateLib"
)

var statesList []BotState

func newBotStateWrapper(
	BotStateName string,
	MessageEnter StringifyArray,
	MessageExit StringifyArray,
	Keyboard *BotKeyboard,
	Handler ContextHandler,
) BotState {
	newState := NewBotState(
		BotStateName,
		MessageEnter,
		MessageExit,
		Keyboard,
		Handler,
	)
	statesList = append(statesList, newState)
	return newState
}
