package states

import (
	"PsychoApp/storage/repo"
	"PsychoApp/tgbot/helpers"
	msg "PsychoApp/tgbot/messages"
	"PsychoApp/tgbot/stateBot/context"

	. "github.com/Ewasince/go-telegram-state-bot/enums"
	. "github.com/Ewasince/go-telegram-state-bot/helpers"
	. "github.com/Ewasince/go-telegram-state-bot/interfaces"
	. "github.com/Ewasince/go-telegram-state-bot/keyboard"
)

var MainKeyboard = BotKeyboard{
	Keyboard: []ButtonsRow{
		{
			BotButton{
				ButtonTitle:   "Новая запись",
				ButtonHandler: CommandStartHandler,
			},
		},
		{
			BotButton{
				ButtonTitle:   "Мои записи",
				ButtonHandler: CommandMyStoriesHandler,
			},
		},
		{
			BotButton{
				ButtonTitle:   "Указать настроение",
				ButtonHandler: CommandSetMoodHandler,
			},
		},
		{
			BotButton{
				ButtonTitle:   "Напоминание",
				ButtonHandler: CommandScheduleHandler,
			},
		},
	},
}

var CommandStartHandler = helpers.RegisterWrapper(
	func(_ BotContext) HandlerResponse {
		return HandlerResponse{
			NextState:      DefaultState,
			TransitionType: GoStateForce,
		}
	},
)

var CommandMyStoriesHandler = helpers.RegisterWrapper(
	func(_ BotContext) HandlerResponse {

		return HandlerResponse{
			NextState:      DefaultState,
			TransitionType: GoStateForce,
		}
	},
)

var CommandScheduleHandler = helpers.RegisterWrapper(
	func(_ BotContext) HandlerResponse {
		return HandlerResponse{
			NextState:      &FillScheduleState,
			TransitionType: GoStateForce,
		}
	},
)

var CommandSetMoodHandler = helpers.RegisterWrapper(
	func(_ BotContext) HandlerResponse {
		return HandlerResponse{
			NextState:      &SetMoodState,
			TransitionType: GoStateForce,
		}
	},
)

var CommandNoScheduleHandler = helpers.RegisterWrapper(
	func(c BotContext) HandlerResponse {
		ctx := *c.(*context.MyBotContext)

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
	},
)
