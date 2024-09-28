package tryStates

import (
	tl "PsychoBot/teleBotStateLib"
	"PsychoBot/teleBotStateLib/apiUtils"
	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"log"
)

func GetProcessFunc(sender *apiUtils.BaseSenderHandler) func(*tg.Message) {
	cache := tl.NewBaseStateCacheManager(&InitState)
	manager := tl.NewBotStatesManager(
		[]tl.BotState{
			InitState,
			RegisterState,
			FillStoryState,
		},
		[]tl.BotCommand{
			startCommand,
		},
		cache,
	)

	return func(message *tg.Message) {
		ctx, err := NewMyBotContext(message, sender)
		if err != nil {
			log.Panic(err)
			return
		}
		err = manager.ProcessMessage(ctx)
		if err != nil {
			log.Panic(err)
			return
		}
	}
}
