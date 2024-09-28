package keyboards

import (
	"PsychoBot/stateBot/interacts"
	tl "PsychoBot/teleBotStateLib"
)

var ButtonStart = tl.BotButton{
	ButtonTitle:   "Новая запись",
	ButtonHandler: interacts.CommandStartHandler,
}
var ButtonSchedule = tl.BotButton{
	ButtonTitle:   "Напоминание",
	ButtonHandler: interacts.CommandScheduleHandler,
}
var ButtonNoSchedule = tl.BotButton{
	ButtonTitle:   "Убрать напоминание",
	ButtonHandler: interacts.CommandNoScheduleHandler,
}

var MainKeyboard = &tl.BotKeyboard{
	Keyboard: []tl.ButtonsRow{
		{
			ButtonStart,
		},
		{
			ButtonSchedule,
			ButtonNoSchedule,
		},
	},
}
