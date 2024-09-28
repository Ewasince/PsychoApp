package commands

import (
	msg "PsychoBot/messages"
	. "PsychoBot/teleBotStateLib"
	"PsychoBot/tryStates/context"
	"PsychoBot/tryStates/states"
	"StorageModule/repo"
	"errors"
)

var NoScheduleCommand = BotCommand{
	CommandMessage: "no_schedule",
	CommandHandler: func(c BotContext) (HandlerResponse, error) {
		ctx := *c.(*context.MyBotContext)
		if !ctx.IsPatientRegistered() {
			return HandlerResponse{
				NextState:      &states.RegisterState,
				TransitionType: GoState,
			}, nil
		}

		ctx.Patient.NextSchedule = nil
		err := repo.UpdateSchedule(ctx.Patient)
		if err != nil {
			return HandlerResponse{}, err
		}

		if ctx.Patient.NextSchedule == nil {
			_ = ctx.CreateAndSendMessage(msg.ResetScheduleSuccess)
		} else {
			return HandlerResponse{}, errors.New("cant reset schedule")
		}

		return HandlerResponse{
			NextState:      &states.DefaultState,
			TransitionType: GoState,
		}, nil
	},
}
