package stateBot

import (
	msg "PsychoBot/messages"
	"PsychoBot/stateBot/commands"
	"PsychoBot/stateBot/context"
	"PsychoBot/stateBot/states"
	"fmt"
	tl "github.com/Ewasince/go-telegram-state-bot"
	"github.com/Ewasince/go-telegram-state-bot/apiUtils"
	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"runtime/debug"
)

func GetProcessFunc(sender *apiUtils.BaseSenderHandler) func(*tg.Message) {
	states.FillStoryMindState.Keyboard = states.DefaultKeyboard
	states.FillStorySituationState.Keyboard = states.DefaultKeyboard
	//states.FillScheduleState.Keyboard = states.ScheduleKeyboard

	cache := tl.NewBaseStateCacheManager(&states.InitState)
	manager := tl.NewBotStatesManager(
		[]tl.BotCommand{
			commands.StartCommand,
			commands.ScheduleCommand,
			commands.NoScheduleCommand,
		},
		cache,
	)

	return func(message *tg.Message) {
		defer func() {
			if r := recover(); r != nil {
				fmt.Println("Error occurred when handle message: \n" + string(debug.Stack()))
			}
		}()

		ctx := context.NewMyBotContext(message, sender, msg.BotError)
		manager.ProcessMessage(ctx)
	}
}
