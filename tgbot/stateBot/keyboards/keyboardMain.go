package keyboards

import (
	"PsychoBot/stateBot/interacts"
	tl "PsychoBot/teleBotStateLib"
)

var ButtonStart = tl.BotButton{
	ButtonTitle:   "Новая запись",
	ButtonHandler: interacts.InteractStartHandler,
}
var ButtonSchedule = tl.BotButton{
	ButtonTitle:   "Напоминание",
	ButtonHandler: interacts.InteractScheduleHandler,
}
var ButtonNoSchedule = tl.BotButton{
	ButtonTitle:   "Убрать напоминание",
	ButtonHandler: interacts.InteractNoScheduleHandler,
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
