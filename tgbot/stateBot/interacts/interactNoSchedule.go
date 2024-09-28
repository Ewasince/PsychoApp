package interacts

import (
	"PsychoBot/messages"
	"PsychoBot/stateBot/context"
	"PsychoBot/stateBot/states"
	tl "PsychoBot/teleBotStateLib"
	"StorageModule/repo"
	"errors"
)

func InteractNoScheduleHandler(c tl.BotContext) (tl.HandlerResponse, error) {
	ctx := *c.(*context.MyBotContext)
	if !ctx.IsPatientRegistered() {
		return tl.HandlerResponse{
			NextState:      states.RegisterState,
			TransitionType: tl.GoStateForce,
		}, nil
	}

	ctx.Patient.NextSchedule = nil
	err := repo.UpdateSchedule(ctx.Patient)
	if err != nil {
		return tl.HandlerResponse{}, err
	}

	if ctx.Patient.NextSchedule == nil {
		_ = ctx.CreateAndSendMessage(messages.ResetScheduleSuccess)
	} else {
		return tl.HandlerResponse{}, errors.New("cant reset schedule")
	}

	return tl.HandlerResponse{
		NextState:      states.DefaultState,
		TransitionType: tl.GoStateForce,
	}, nil
}
