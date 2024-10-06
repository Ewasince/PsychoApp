package commands

import (
	. "EnvironmentModule"
	"PsychoBot/stateBot/context"
	. "github.com/Ewasince/go-telegram-state-bot"
)

var DevCommand = BotCommand{
	CommandMessage: "dev",
	CommandHandler: CommandDevHandler,
}

func CommandDevHandler(c BotContext) HandlerResponse {
	ctx := *c.(*context.MyBotContext)

	if ctx.PatientTgId != Env.DEV_USER_TG_ID {
		return HandlerResponse{}
	}
	ctx.CreateAndSendMessage("вы врошли в dev режим!")

	//if !ctx.IsPatientRegistered() {
	//	return HandlerResponse{
	//		NextState:      &RegisterState,
	//		TransitionType: GoStateForce,
	//	}
	//}

	//return HandlerResponse{
	//	NextState:      DefaultState,
	//	TransitionType: GoStateForce,
	//}
	return HandlerResponse{}

}
