package commands

import (
	. "EnvironmentModule"
	"PsychoBot/stateBot/context"
	"StorageModule/repo"
	. "github.com/Ewasince/go-telegram-state-bot"
	"strings"
)

var DevCommand = BotCommand{
	CommandMessage: "dev",
	CommandHandler: CommandDevHandler,
}

func CommandDevHandler(c BotContext) HandlerResponse {
	ctx := *c.(*context.MyBotContext)

	if ctx.PatientTgId != Env.DEV_USER_TG_ID {
		return HandlerResponse{}
	}

	message := ctx.GetMessageText()
	message = strings.Replace(message, "/dev ", "", 1)
	messageParts := strings.Split(message, " ")
	if len(messageParts) == 0 {
		ctx.CreateAndSendMessage("нет команды")
		return HandlerResponse{}
	}
	command := messageParts[0]

	switch command {
	case "invite":
		if len(messageParts) < 2 {
			ctx.CreateAndSendMessage("нет имейла")
			return HandlerResponse{}
		}
		email := messageParts[1]
		if !repo.CheckEmail(email) {
			repo.AddEmail(email)
			ctx.CreateAndSendMessage("добавил")
		} else {
			ctx.CreateAndSendMessage("уже есть")
		}
	}
	return HandlerResponse{}
}
