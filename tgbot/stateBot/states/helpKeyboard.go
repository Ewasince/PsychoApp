package states

import (
	msg "PsychoBot/messages"
	"PsychoBot/stateBot/context"
	"PsychoBot/stateBot/helpers"
	. "github.com/Ewasince/go-telegram-state-bot"
)

var HelpKeyboard BotKeyboard

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
	HelpKeyboard = BotKeyboard{Keyboard: rows}
}

func keyboardHelpButtonHandler(c BotContext) HandlerResponse {
	ctx := *c.(*context.MyBotContext)

	switch ctx.MessageText {
	case msg.BeliefButtonHelp:
		ctx.CreateAndSendMessage(msg.BeliefHelp)
		return HandlerResponse{}
	case msg.MindButtonHelp:
		ctx.CreateAndSendMessage(msg.MindHelp)
		return HandlerResponse{}
	case msg.SituationButtonHelp:
		ctx.CreateAndSendMessage(msg.SituationHelp)
		return HandlerResponse{}
	case msg.ReactionsButtonHelp:
		ctx.CreateAndSendMessage(msg.ReactionsHelp)
		return HandlerResponse{}
	default:
		ctx.CreateAndSendMessage(msg.NotFoundHelp)
		return HandlerResponse{}
	}
}
