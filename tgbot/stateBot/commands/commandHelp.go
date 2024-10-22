package commands

import (
	"PsychoBot/stateBot/context"
	. "PsychoBot/stateBot/states"
	. "github.com/Ewasince/go-telegram-state-bot"
)

var HelpCommand = BotCommand{
	CommandMessage: "help",
	CommandHandler: CommandHelpHandler,
}

func CommandHelpHandler(c BotContext) HandlerResponse {
	ctx := *c.(*context.MyBotContext)
	if !ctx.IsPatientRegistered() {
		return HandlerResponse{
			NextState:      &RegisterState,
			TransitionType: GoStateForce,
		}
	}
	return HandlerResponse{
		NextState:      &HelpState,
		TransitionType: GoStateForce,
	}
}
