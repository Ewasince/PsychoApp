package commands

import (
	. "PsychoApp/environment"
	"PsychoApp/storage/repo"
	"PsychoApp/tgbot/stateBot/context"
	"github.com/Ewasince/go-telegram-state-bot/helpers"
	. "github.com/Ewasince/go-telegram-state-bot/interfaces"
	. "github.com/Ewasince/go-telegram-state-bot/models"
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
		helpers.CreateAndSendMessage("нет команды", ctx)
		return HandlerResponse{}
	}
	command := messageParts[0]

	switch command {
	case "invite":
		if len(messageParts) < 2 {
			helpers.CreateAndSendMessage("нет имейла", ctx)
			return HandlerResponse{}
		}
		email := messageParts[1]
		if !repo.CheckEmail(email) {
			repo.AddEmail(email)
			helpers.CreateAndSendMessage("добавил", ctx)
		} else {
			helpers.CreateAndSendMessage("уже есть", ctx)
		}
	}
	return HandlerResponse{}
}
