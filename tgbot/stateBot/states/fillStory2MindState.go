package states

import (
	msg "PsychoBot/messages"
	"PsychoBot/stateBot/context"
	. "github.com/Ewasince/go-telegram-state-bot"
)

var FillStoryMindState = NewBotState(
	"Fill Story mind state",
	BotMessages{msg.WhatMind},
	nil,
	&DefaultKeyboard,
	messageHandlerFillStoryMindState,
)

func messageHandlerFillStoryMindState(c BotContext) HandlerResponse {
	ctx := c.(*context.MyBotContext)

	story := ctx.GetStory()

	story.Mind = ctx.MessageText
	return HandlerResponse{
		NextState:      &FillStoryPrimaryEmotionState,
		TransitionType: GoState,
	}
}
