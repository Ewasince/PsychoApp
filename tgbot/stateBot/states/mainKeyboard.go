package states

import (
	"PsychoBot/messages"
	"PsychoBot/stateBot/context"
	tl "PsychoBot/teleBotStateLib"
	"StorageModule/repo"
	"errors"
)

var ButtonStart = tl.BotButton{
	ButtonTitle:   "Новая запись",
	ButtonHandler: CommandStartHandler,
}
var ButtonSchedule = tl.BotButton{
	ButtonTitle:   "Напоминание",
	ButtonHandler: CommandScheduleHandler,
}

//	var ButtonNoSchedule = tl.BotButton{
//		ButtonTitle:   "Убрать напоминание",
//		ButtonHandler: CommandNoScheduleHandler,
//	}
var ButtonSetMood = tl.BotButton{
	ButtonTitle:   "Указать настроение",
	ButtonHandler: CommandSetMoodHandler,
}

var MainKeyboard = tl.BotKeyboard{
	Keyboard: []tl.ButtonsRow{
		{
			ButtonStart,
		},
		{
			ButtonSetMood,
		},
		{
			ButtonSchedule,
		},
	},
}

func CommandStartHandler(c tl.BotContext) (tl.HandlerResponse, error) {
	ctx := *c.(*context.MyBotContext)

	if !ctx.IsPatientRegistered() {
		return tl.HandlerResponse{
			NextState:      &RegisterState,
			TransitionType: tl.GoStateForce,
		}, nil
	}

	return tl.HandlerResponse{
		NextState:      &FillStoryState,
		TransitionType: tl.GoStateForce,
	}, nil
}

func CommandScheduleHandler(c tl.BotContext) (tl.HandlerResponse, error) {
	ctx := *c.(*context.MyBotContext)
	if !ctx.IsPatientRegistered() {
		return tl.HandlerResponse{
			NextState:      &RegisterState,
			TransitionType: tl.GoStateForce,
		}, nil
	}
	return tl.HandlerResponse{
		NextState:      &FillScheduleState,
		TransitionType: tl.GoStateForce,
	}, nil
}

func CommandSetMoodHandler(c tl.BotContext) (tl.HandlerResponse, error) {
	ctx := *c.(*context.MyBotContext)
	if !ctx.IsPatientRegistered() {
		return tl.HandlerResponse{
			NextState:      &RegisterState,
			TransitionType: tl.GoStateForce,
		}, nil
	}
	return tl.HandlerResponse{
		NextState:      &SetMoodState,
		TransitionType: tl.GoStateForce,
	}, nil
}

func CommandNoScheduleHandler(c tl.BotContext) (tl.HandlerResponse, error) {
	ctx := *c.(*context.MyBotContext)
	if !ctx.IsPatientRegistered() {
		return tl.HandlerResponse{
			NextState:      &RegisterState,
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
		NextState:      DefaultState,
		TransitionType: tl.GoStateForce,
	}, nil
}
