package stateBot

import (
	msg "PsychoBot/messages"
	"PsychoBot/stateBot/commands"
	"PsychoBot/stateBot/context"
	"PsychoBot/stateBot/keyboards"
	"PsychoBot/stateBot/states"
	tl "PsychoBot/teleBotStateLib"
	"PsychoBot/teleBotStateLib/apiUtils"
	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"log"
)

func GetProcessFunc(sender *apiUtils.BaseSenderHandler) func(*tg.Message) {
	states.FillStoryState.Keyboard = keyboards.DefaultKeyboard
	states.FillScheduleState.Keyboard = keyboards.ScheduleKeyboard

	cache := tl.NewBaseStateCacheManager(states.InitState)
	manager := tl.NewBotStatesManager(
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
			_ = ctx.CreateAndSendMessage(msg.BotError)
			log.Panic(err)
			return
		}
	}
}
