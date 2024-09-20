package interacts

import tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"

var StartCommandButton BotInteract = "start"
var ScheduleCommandButton BotInteract = "schedule"
var ResetScheduleCommandButton BotInteract = "no_schedule"
var NewEntryButton BotInteract = "Новая запись"

var NumericKeyboard = tg.NewReplyKeyboard(
	tg.NewKeyboardButtonRow(
		tg.NewKeyboardButton(NewEntryButton.ToString()),
	),
)
