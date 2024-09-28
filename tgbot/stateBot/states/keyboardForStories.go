package states

import (
	. "PsychoBot/teleBotStateLib"
	"fmt"
)

var MoodKeyboard *BotKeyboard
var PowerKeyboard *BotKeyboard

func init() {
	emotions := []string{
		"Злость",
		"Трагедия",
		"Бипки",
	}
	separateBy := 1

	var rows []ButtonsRow
	var row ButtonsRow

	for i, emotion := range emotions {
		button := BotButton{
			ButtonTitle:   emotion,
			ButtonHandler: keyboardEmptyHandler,
		}
		row = append(row, button)

		if (i+1)%separateBy == 0 {
			rows = append(rows, row)
			row = ButtonsRow{}
		}
	}
	rows = append(rows, ButtonsRow{
		BotButton{
			ButtonTitle:   "Новая запись",
			ButtonHandler: keyboardBackButtonHandler,
		},
	})
	MoodKeyboard = &BotKeyboard{Keyboard: rows}

	rows = []ButtonsRow{}
	row = ButtonsRow{}

	for i := 1; i <= 10; i++ {
		button := BotButton{
			ButtonTitle:   fmt.Sprint(i),
			ButtonHandler: keyboardEmptyHandler,
		}
		row = append(row, button)
	}
	rows = append(rows, row)
	rows = append(rows, ButtonsRow{
		BotButton{
			ButtonTitle:   "Новая запись",
			ButtonHandler: keyboardBackButtonHandler,
		},
	})
	PowerKeyboard = &BotKeyboard{Keyboard: rows}
}

func keyboardEmptyHandler(c BotContext) (HandlerResponse, error) {
	return HandlerResponse{}, nil
}

func keyboardBackButtonHandler(c BotContext) (HandlerResponse, error) {
	return HandlerResponse{
		NextState:      DefaultState,
		TransitionType: GoStateForce,
	}, nil
}
