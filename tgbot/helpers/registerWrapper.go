package helpers

import (
	"PsychoApp/tgbot/stateBot/context"
	"PsychoApp/tgbot/stateBot/states"
	"github.com/Ewasince/go-telegram-state-bot/enums"
	"github.com/Ewasince/go-telegram-state-bot/interfaces"
)

func RegisterWrapper(innerFunction func(c interfaces.BotContext) interfaces.HandlerResponse) func(c interfaces.BotContext) interfaces.HandlerResponse {
	return func(c interfaces.BotContext) interfaces.HandlerResponse {
		ctx := *c.(*context.MyBotContext)

		if !ctx.IsPatientRegistered() {
			return interfaces.HandlerResponse{
				NextState:      &states.RegisterState,
				TransitionType: enums.GoStateForce,
			}
		}

		return innerFunction(c)
	}
}
