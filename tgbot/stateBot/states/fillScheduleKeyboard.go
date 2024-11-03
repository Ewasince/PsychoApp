package states

import (
	msg "PsychoBot/messages"
	"PsychoBot/stateBot/context"
	"PsychoBot/stateBot/helpers"
	"fmt"
	. "github.com/Ewasince/go-telegram-state-bot/helpers"
	. "github.com/Ewasince/go-telegram-state-bot/interfaces"
	. "github.com/Ewasince/go-telegram-state-bot/keyboard"
	"strconv"
	"strings"
)

var ScheduleKeyboard BotKeyboard

func init() {
	var rows []ButtonsRow

	hours := helpers.MakeRangeStr(0, 23)
	var fullHours []string

	for _, hour := range hours {
		fullHours = append(fullHours, fmt.Sprintf("%v:00", hour))
	}

	rows = helpers.CreateArrayKeyboard(fullHours, 8, keyboardHourButtonHandler)
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
	ScheduleKeyboard = BotKeyboard{Keyboard: rows}
}

func keyboardHourButtonHandler(c BotContext) HandlerResponse {
	ctx := *c.(*context.MyBotContext)
	timeData := strings.Split(ctx.MessageText, ":")
	if len(timeData) == 0 {
		CreateAndSendMessage(msg.DontRecognizeHour, ctx)
		return HandlerResponse{}
	}
	hour, err := strconv.Atoi(timeData[0])
	if err != nil {
		CreateAndSendMessage(msg.DontRecognizeHour, ctx)
		return HandlerResponse{}
	}
	return FillSchedule(c, hour)
}
