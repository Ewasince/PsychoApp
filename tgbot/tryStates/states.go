package tryStates

import . "PsychoBot/teleBotStateLib"

const (
	BotInitState BotStateId = iota
)

var InitState = NewBotState(
	BotInitState,
	nil,
	nil,
	nil,
	func(c *BotContext) (BotStateId, bool, error) {
		err := (*c).CreateAndSendMessage("Hello, World!")
		return 0, false, err
	},
)
