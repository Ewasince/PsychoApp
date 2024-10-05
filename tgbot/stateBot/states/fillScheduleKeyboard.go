package states

import (
	msg "PsychoBot/messages"
	"PsychoBot/stateBot/context"
	"fmt"
	. "github.com/Ewasince/go-telegram-state-bot"
	"strconv"
	"strings"
)

var ScheduleKeyboard *BotKeyboard

func init() {
	start := 0
	finish := 23
	separateBy := 8

	var rows []ButtonsRow
	var row ButtonsRow

	for i := start; i <= finish; i++ {
		button := BotButton{
			ButtonTitle:   fmt.Sprintf("%v:00", i),
			ButtonHandler: keyboardHourButtonHandler,
		}
		row = append(row, button)

		if (i+1)%separateBy == 0 {
			rows = append(rows, row)
			row = ButtonsRow{}
		}
	}
	rows = append(rows, ButtonsRow{
		BotButton{
			ButtonTitle:   "Назад",
			ButtonHandler: keyboardBackButtonHandler,
		},
		BotButton{
			ButtonTitle:   "Сбросить напоминание",
			ButtonHandler: CommandNoScheduleHandler,
		},
	})
	ScheduleKeyboard = &BotKeyboard{Keyboard: rows}
}

func keyboardHourButtonHandler(c BotContext) HandlerResponse {
	ctx := *c.(*context.MyBotContext)
	timeData := strings.Split(ctx.MessageText, ":")
	if len(timeData) == 0 {
		ctx.CreateAndSendMessage(msg.DontRecognizeHour)
		return HandlerResponse{}
	}
	hour, err := strconv.Atoi(timeData[0])
	if err != nil {
		ctx.CreateAndSendMessage(msg.DontRecognizeHour)
		return HandlerResponse{}
	}
	return FillSchedule(c, hour)
}
