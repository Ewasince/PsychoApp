package states

import (
	msg "PsychoBot/messages"
	"PsychoBot/stateBot/context"
	. "github.com/Ewasince/go-telegram-state-bot/enums"
	. "github.com/Ewasince/go-telegram-state-bot/interfaces"
	. "github.com/Ewasince/go-telegram-state-bot/message_types"
	. "github.com/Ewasince/go-telegram-state-bot/states"
)

var FillStoryMindState = NewBotState(
	"Fill Story mind state",
	TextMessage(msg.WhatMind),
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
