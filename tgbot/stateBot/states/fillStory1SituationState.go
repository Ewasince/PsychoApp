package states

import (
	msg "PsychoBot/messages"
	"PsychoBot/stateBot/context"
	. "github.com/Ewasince/go-telegram-state-bot"
)

var FillStorySituationState = NewBotState(
	"Fill Story situation state",
	BotMessageHandler(enterMessageHandlerFillStorySituationState),
	nil,
	&DefaultKeyboard,
	messageHandlerFillStorySituationState,
)

func enterMessageHandlerFillStorySituationState(c BotContext) ([]string, error) {
	ctx := *c.(*context.MyBotContext)
	ctx.NewStory()
	return []string{msg.WhatHappened}, nil
}
func messageHandlerFillStorySituationState(c BotContext) HandlerResponse {
	ctx := c.(*context.MyBotContext)

	story := ctx.GetStory()

	story.Situation = ctx.MessageText
	return HandlerResponse{
		NextState:      &FillStoryMindState,
		TransitionType: GoState,
	}
}
