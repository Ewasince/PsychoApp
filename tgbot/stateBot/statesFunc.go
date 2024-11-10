package stateBot

import (
	msg "PsychoApp/tgbot/messages"
	"PsychoApp/tgbot/stateBot/commands"
	"PsychoApp/tgbot/stateBot/context"
	"PsychoApp/tgbot/stateBot/states"
	"fmt"
	tl "github.com/Ewasince/go-telegram-state-bot"
	. "github.com/Ewasince/go-telegram-state-bot/api_utils"
	"github.com/Ewasince/go-telegram-state-bot/models"
	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"runtime/debug"
)

func GetProcessFunc(sender *BaseSenderHandler) func(*tg.Message) {
	states.DefaultKeyboard = states.MainKeyboard

	cache := tl.NewBaseStateCacheManager(&states.InitState)
	manager := tl.NewBotStatesManager(
		[]models.BotCommand{
			commands.StartCommand,
			commands.ScheduleCommand,
			commands.NoScheduleCommand,
			commands.DevCommand,
			commands.InfoCommand,
		},
		cache,
	)

	return func(message *tg.Message) {
		defer func() {
			if r := recover(); r != nil {
				fmt.Println("Error occurred when handle message: " + r.(error).Error() + "\n" + string(debug.Stack()))
			}
		}()

		ctx := context.NewMyBotContext(message, sender, msg.BotError)
		manager.ProcessMessage(ctx)
	}
}
