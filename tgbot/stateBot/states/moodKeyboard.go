package states

import (
	"PsychoBot/stateBot/context"
	"PsychoBot/stateBot/helpers"
	. "PsychoBot/teleBotStateLib"
	"StorageModule/repo"
	"strconv"
	"time"
)

var MoodKeyboard BotKeyboard

func init() {

	emotionPowers := helpers.MakeRangeStr(-5, 5)
	rows := helpers.CreateArrayKeyboard(emotionPowers, 0, keyboardMoodHandler)
	rows = append(rows, ButtonsRow{
		BotButton{
			ButtonTitle:   "Новая запись",
			ButtonHandler: keyboardBackButtonHandler,
		},
	})
	MoodKeyboard = BotKeyboard{Keyboard: rows}
}

func keyboardMoodHandler(c BotContext) HandlerResponse {
	ctx := c.(*context.MyBotContext)
	if !ctx.IsPatientRegistered() {
		panic("user not registered")
	}

	value, err := strconv.Atoi(ctx.MessageText)
	if err != nil {
		panic(err)
	}

	err = repo.SetMood(ctx.Patient.ID, time.Now(), int8(value))
	if err != nil {
		panic(err)
	}
	return HandlerResponse{
		NextState:      DefaultState,
		TransitionType: GoState,
	}
}
