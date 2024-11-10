package states

import (
	"PsychoApp/storage/repo"
	msg "PsychoApp/tgbot/messages"
	"PsychoApp/tgbot/stateBot/context"

	. "github.com/Ewasince/go-telegram-state-bot/enums"
	. "github.com/Ewasince/go-telegram-state-bot/helpers"
	. "github.com/Ewasince/go-telegram-state-bot/interfaces"
	. "github.com/Ewasince/go-telegram-state-bot/keyboard"
)

var ButtonStart = BotButton{
	ButtonTitle:   "Новая запись",
	ButtonHandler: CommandStartHandler,
}
var ButtonSchedule = BotButton{
	ButtonTitle:   "Напоминание",
	ButtonHandler: CommandScheduleHandler,
}

//	var ButtonNoSchedule = BotButton{
//		ButtonTitle:   "Убрать напоминание",
//		ButtonHandler: CommandNoScheduleHandler,
//	}
var ButtonSetMood = BotButton{
	ButtonTitle:   "Указать настроение",
	ButtonHandler: CommandSetMoodHandler,
}

var MainKeyboard = BotKeyboard{
	Keyboard: []ButtonsRow{
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

func CommandStartHandler(c BotContext) HandlerResponse {
	ctx := *c.(*context.MyBotContext)

	if !ctx.IsPatientRegistered() {
		return HandlerResponse{
			NextState:      &RegisterState,
			TransitionType: GoStateForce,
		}
	}

	return HandlerResponse{
		NextState:      DefaultState,
		TransitionType: GoStateForce,
	}
}

func CommandScheduleHandler(c BotContext) HandlerResponse {
	ctx := *c.(*context.MyBotContext)
	if !ctx.IsPatientRegistered() {
		return HandlerResponse{
			NextState:      &RegisterState,
			TransitionType: GoStateForce,
		}
	}
	return HandlerResponse{
		NextState:      &FillScheduleState,
		TransitionType: GoStateForce,
	}
}

func CommandSetMoodHandler(c BotContext) HandlerResponse {
	ctx := *c.(*context.MyBotContext)
	if !ctx.IsPatientRegistered() {
		return HandlerResponse{
			NextState:      &RegisterState,
			TransitionType: GoStateForce,
		}
	}
	return HandlerResponse{
		NextState:      &SetMoodState,
		TransitionType: GoStateForce,
	}
}

func CommandNoScheduleHandler(c BotContext) HandlerResponse {
	ctx := *c.(*context.MyBotContext)
	if !ctx.IsPatientRegistered() {
		return HandlerResponse{
			NextState:      &RegisterState,
			TransitionType: GoStateForce,
		}
	}

	ctx.Patient.NextSchedule = nil
	err := repo.UpdateSchedule(ctx.Patient)
	if err != nil {
		panic(err)
	}

	if ctx.Patient.NextSchedule == nil {
		CreateAndSendMessage(msg.ResetScheduleSuccess, ctx)
	} else {
		panic("cant reset schedule")
	}

	return HandlerResponse{
		NextState:      DefaultState,
		TransitionType: GoStateForce,
	}
}
