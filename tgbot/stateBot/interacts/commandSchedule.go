package interacts

import (
	"PsychoBot/stateBot/context"
	"PsychoBot/stateBot/states"
	tl "PsychoBot/teleBotStateLib"
)

func CommandScheduleHandler(c tl.BotContext) (tl.HandlerResponse, error) {
	ctx := *c.(*context.MyBotContext)
	if !ctx.IsPatientRegistered() {
		return tl.HandlerResponse{
			NextState:      states.RegisterState,
			TransitionType: tl.GoStateForce,
		}, nil
	}
	return tl.HandlerResponse{
		NextState:      states.FillScheduleState,
		TransitionType: tl.GoStateForce,
	}, nil
}
