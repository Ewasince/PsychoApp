package states

import (
	msg "PsychoBot/messages"
	"PsychoBot/stateBot/context"
	"PsychoBot/stateBot/helpers"
	"StorageModule/repo"
	. "github.com/Ewasince/go-telegram-state-bot"
	"strconv"
)

var FillStoryEmotionState = NewBotState(
	"Fill Story emotion state",
	BotMessageHandler(enterMessageHandlerFillStoryEmotionState),
	BotMessages{msg.WhatEntryDone},
	nil,
	messageHandlerFillStoryEmotionState,
)

func enterMessageHandlerFillStoryEmotionState(c BotContext) ([]string, error) {
	ctx := *c.(*context.MyBotContext)
	ctx.NewStory()
	return []string{msg.WhatHappened}, nil
}
func messageHandlerFillStoryEmotionState(c BotContext) HandlerResponse {
	ctx := c.(*context.MyBotContext)

	//handlerResponse, isButtonPressed := EmotionsKeyboard.ProcessMessage(ctx)
	//if isButtonPressed {
	//	newKeyboard := EmotionsKeyboardMap[ctx.MessageText]
	//
	//	ctx.SetKeyboard(&PowerKeyboard)
	//	ctx.CreateAndSendMessage(msg.WhatPower)
	//}

	for _, kb := range []*BotKeyboard{
		&EmotionsKeyboardHappy,
		&EmotionsKeyboardAngry,
		&EmotionsKeyboardSad,
		&EmotionsKeyboardFear,
	} {
		handlerResponse, isButtonPressed := kb.ProcessMessage(ctx)

		story := ctx.GetStory()

		// back button was pressed
		if isButtonPressed && handlerResponse.TransitionType == GoStateForce {
			return handlerResponse
		}
		if isButtonPressed {
			story.Emotion = ctx.MessageText

			ctx.SetKeyboard(&PowerKeyboard)
			ctx.CreateAndSendMessage(msg.WhatPower)

			return HandlerResponse{
				NextState:      &FillStoryState,
				TransitionType: GoState,
			}

		}

	}
	return HandlerResponse{
		NextState:      nil,
		TransitionType: ReloadState,
	}
}

func processKeyboard(ctx *context.MyBotContext, kb *BotKeyboard) (HandlerResponse, bool) {
	handlerResponse, isButtonPressed := kb.ProcessMessage(ctx)
	if !isButtonPressed {
		ctx.SetKeyboard(&EmotionsKeyboard)
		ctx.CreateAndSendMessage(msg.WhatEmotionError)
		return HandlerResponse{}, true
	}
	if handlerResponse.TransitionType == GoStateForce {
		return handlerResponse, true
	}
	return HandlerResponse{}, false
}
