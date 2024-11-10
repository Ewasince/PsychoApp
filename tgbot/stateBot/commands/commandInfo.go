package commands

import (
	"PsychoApp/tgbot/stateBot/context"
	. "PsychoApp/tgbot/stateBot/states"
	. "github.com/Ewasince/go-telegram-state-bot/enums"
	. "github.com/Ewasince/go-telegram-state-bot/interfaces"
	. "github.com/Ewasince/go-telegram-state-bot/models"
)

var InfoCommand = BotCommand{
	CommandMessage: "info",
	CommandHandler: CommandInfoHandler,
}

func CommandInfoHandler(c BotContext) HandlerResponse {
	ctx := *c.(*context.MyBotContext)
	if !ctx.IsPatientRegistered() {
		return HandlerResponse{
			NextState:      &RegisterState,
			TransitionType: GoStateForce,
		}
	}
	return HandlerResponse{
		NextState:      &InfoState,
		TransitionType: GoStateForce,
	}
}
