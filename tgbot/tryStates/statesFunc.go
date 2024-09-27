package tryStates

import (
	tl "PsychoBot/teleBotStateLib"
	"PsychoBot/teleBotStateLib/apiUtils"
	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"log"
)

func GetProcessFunc(sender *apiUtils.BaseSenderHandler) func(*tg.Message) {
	cache := tl.NewBaseStateCacheManager()
	manager := tl.NewBotStatesManager(
		[]tl.BotState{
			InitState,
		},
		[]tl.BotCommand{
			startCommand,
		},
		cache,
	)

	return func(message *tg.Message) {
		var ctx tl.BotContext = tl.NewContext(message, sender)
		err := manager.ProcessMessage(&ctx)
		if err != nil {
			log.Panic(err)
		}
	}
}
