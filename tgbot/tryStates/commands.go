package tryStates

import . "PsychoBot/teleBotStateLib"

var startCommand = BotCommand{
	CommandMessage: "start",
	CommandHandler: func(c *BotContext) (BotStateId, bool, error) {
		return 0, false, (*c).CreateAndSendMessage("Start command")
	},
}
