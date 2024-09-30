package states

import (
	"PsychoBot/stateBot/helpers"
	. "PsychoBot/teleBotStateLib"
)

var EmotionsKeyboard BotKeyboard
var PowerKeyboard BotKeyboard

func init() {
	emotions := []string{
		"Злость",
		"Трагедия",
		"Бипки",
	}

	rows := helpers.CreateArrayKeyboard(emotions, 1, keyboardEmptyHandler)
	rows = append(rows, ButtonsRow{
		BotButton{
			ButtonTitle:   "Новая запись",
			ButtonHandler: keyboardBackButtonHandler,
		},
	})
	EmotionsKeyboard = BotKeyboard{Keyboard: rows}

	emotionPowers := helpers.MakeRangeStr(1, 10)
	rows = helpers.CreateArrayKeyboard(emotionPowers, 0, keyboardEmptyHandler)
	rows = append(rows, ButtonsRow{
		BotButton{
			ButtonTitle:   "Новая запись",
			ButtonHandler: keyboardBackButtonHandler,
		},
	})
	PowerKeyboard = BotKeyboard{Keyboard: rows}
}
