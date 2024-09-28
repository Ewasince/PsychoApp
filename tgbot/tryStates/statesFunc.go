package tryStates

import (
	tl "PsychoBot/teleBotStateLib"
	"PsychoBot/teleBotStateLib/apiUtils"
	"PsychoBot/tryStates/commands"
	"PsychoBot/tryStates/context"
	"PsychoBot/tryStates/states"
	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"log"
)

func GetProcessFunc(sender *apiUtils.BaseSenderHandler) func(*tg.Message) {
	cache := tl.NewBaseStateCacheManager(&states.InitState)
	manager := tl.NewBotStatesManager(
		[]tl.BotState{
			states.InitState,
			states.RegisterState,
			states.FillStoryState,
		},
		[]tl.BotCommand{
			commands.StartCommand,
			commands.ScheduleCommand,
			commands.NoScheduleCommand,
		},
		cache,
	)

	return func(message *tg.Message) {
		ctx, err := context.NewMyBotContext(message, sender)
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
