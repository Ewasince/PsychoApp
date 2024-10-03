package states

import (
	"PsychoBot/messages"
	"PsychoBot/stateBot/context"
	tl "PsychoBot/teleBotStateLib"
	"StorageModule/repo"
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

func CommandStartHandler(c tl.BotContext) tl.HandlerResponse {
	ctx := *c.(*context.MyBotContext)

	if !ctx.IsPatientRegistered() {
		return tl.HandlerResponse{
			NextState:      &RegisterState,
			TransitionType: tl.GoStateForce,
		}
	}

	return tl.HandlerResponse{
		NextState:      &FillStoryState,
		TransitionType: tl.GoStateForce,
	}
}

func CommandScheduleHandler(c tl.BotContext) tl.HandlerResponse {
	ctx := *c.(*context.MyBotContext)
	if !ctx.IsPatientRegistered() {
		return tl.HandlerResponse{
			NextState:      &RegisterState,
			TransitionType: tl.GoStateForce,
		}
	}
	return tl.HandlerResponse{
		NextState:      &FillScheduleState,
		TransitionType: tl.GoStateForce,
	}
}

func CommandSetMoodHandler(c tl.BotContext) tl.HandlerResponse {
	ctx := *c.(*context.MyBotContext)
	if !ctx.IsPatientRegistered() {
		return tl.HandlerResponse{
			NextState:      &RegisterState,
			TransitionType: tl.GoStateForce,
		}
	}
	return tl.HandlerResponse{
		NextState:      &SetMoodState,
		TransitionType: tl.GoStateForce,
	}
}

func CommandNoScheduleHandler(c tl.BotContext) tl.HandlerResponse {
	ctx := *c.(*context.MyBotContext)
	if !ctx.IsPatientRegistered() {
		return tl.HandlerResponse{
			NextState:      &RegisterState,
			TransitionType: tl.GoStateForce,
		}
	}

	ctx.Patient.NextSchedule = nil
	err := repo.UpdateSchedule(ctx.Patient)
	if err != nil {
		panic(err)
	}

	if ctx.Patient.NextSchedule == nil {
		ctx.CreateAndSendMessage(messages.ResetScheduleSuccess)
	} else {
		panic("cant reset schedule")
	}

	return tl.HandlerResponse{
		NextState:      DefaultState,
		TransitionType: tl.GoStateForce,
	}
}
