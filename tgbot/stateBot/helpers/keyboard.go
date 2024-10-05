package helpers

import (
	. "github.com/Ewasince/go-telegram-state-bot"
	"strconv"
)

func CreateArrayKeyboard(options []string, sepBy int, handler ContextHandler) []ButtonsRow {
	if sepBy == 0 {
		sepBy = len(options)
	}

	var rows []ButtonsRow
	var row ButtonsRow

	for i, emotion := range options {
		button := BotButton{
			ButtonTitle:   emotion,
			ButtonHandler: handler,
		}
		row = append(row, button)

		if (i+1)%sepBy == 0 {
			rows = append(rows, row)
			row = ButtonsRow{}
		}
	}

	return rows
}

func MakeRangeStr(min, max int) []string {
	a := make([]string, max-min+1)
	for i := range a {
		a[i] = strconv.Itoa(min + i)
	}
	return a
}
