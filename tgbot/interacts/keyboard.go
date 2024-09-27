package interacts

var ButtonNewEntry = BotButton{
	"Новая запись",
	func() error {
		return nil
	},
}
var ButtonNewMood = BotButton{
	"Указать настроение",
	func() error {
		return nil
	},
}

var MainKeyboard = BotKeyboard{[]ButtonsRow{
	[]BotButton{
		ButtonNewEntry,
		ButtonNewMood,
	},
},
}
