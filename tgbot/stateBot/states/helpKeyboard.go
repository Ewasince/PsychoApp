package states

import (
	msg "PsychoApp/tgbot/messages"
	"PsychoApp/tgbot/stateBot/context"
	"PsychoApp/tgbot/stateBot/helpers"

	. "github.com/Ewasince/go-telegram-state-bot/helpers"
	. "github.com/Ewasince/go-telegram-state-bot/interfaces"
	. "github.com/Ewasince/go-telegram-state-bot/keyboard"
)

var InfoKeyboard BotKeyboard

func init() {
	rows := helpers.CreateArrayKeyboard([]string{
		msg.BeliefButtonHelp,
		msg.MindButtonHelp,
		msg.SituationButtonHelp,
		msg.ReactionsButtonHelp,
	}, 1, keyboardHelpButtonHandler)

	rows = append(rows, ButtonsRow{
		BotButton{
			ButtonTitle:   msg.StartButtonHelp,
			ButtonHandler: keyboardBackButtonHandler,
		},
	})
	InfoKeyboard = BotKeyboard{Keyboard: rows}
}

func keyboardHelpButtonHandler(c BotContext) HandlerResponse {
	ctx := *c.(*context.MyBotContext)

	switch ctx.MessageText {
	case msg.BeliefButtonHelp:
		CreateAndSendMessage(msg.BeliefHelp, ctx)
		return HandlerResponse{}
	case msg.MindButtonHelp:
		CreateAndSendMessage(msg.MindHelp, ctx)
		return HandlerResponse{}
	case msg.SituationButtonHelp:
		CreateAndSendMessage(msg.SituationHelp, ctx)
		return HandlerResponse{}
	case msg.ReactionsButtonHelp:
		CreateAndSendMessage(msg.ReactionsHelp, ctx)
		return HandlerResponse{}
	default:
		CreateAndSendMessage(msg.NotFoundHelp, ctx)
		return HandlerResponse{}
	}
}
