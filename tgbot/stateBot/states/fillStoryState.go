package states

import (
	msg "PsychoBot/messages"
	"PsychoBot/stateBot/context"
	"PsychoBot/stateBot/helpers"
	"StorageModule/repo"
	. "github.com/Ewasince/go-telegram-state-bot"
	"strconv"
)

var FillStoryState = NewBotState(
	"Fill Story state",
	BotMessageHandler(enterMessageHandlerFillStoryState),
	BotMessages{msg.WhatEntryDone},
	nil,
	messageHandlerFillStoryState,
)

func enterMessageHandlerFillStoryState(c BotContext) ([]string, error) {
	ctx := *c.(*context.MyBotContext)
	ctx.NewStory()
	return []string{msg.WhatHappened}, nil
}
func messageHandlerFillStoryState(c BotContext) HandlerResponse {
	ctx := c.(*context.MyBotContext)

	story := ctx.GetStory()

	if story.Situation == "" {
		story.Situation = ctx.MessageText
		ctx.CreateAndSendMessage(msg.WhatMind)
		return HandlerResponse{}
	} else if story.Mind == "" {
		story.Mind = ctx.MessageText
		ctx.SetKeyboard(&EmotionsKeyboard)
		ctx.CreateAndSendMessage(msg.WhatEmotion)
		return HandlerResponse{}
	} else if story.Emotion == "" {
		handlerResponse, shouldRerun := processKeyboard(ctx, &EmotionsKeyboard)
		if shouldRerun {
			return handlerResponse
		}
		story.Emotion = ctx.MessageText
		ctx.SetKeyboard(&PowerKeyboard)
		ctx.CreateAndSendMessage(msg.WhatPower)
		return HandlerResponse{}
	} else if story.Power == 0 {
		handlerResponse, shouldRerun := processKeyboard(ctx, &PowerKeyboard)
		if shouldRerun {
			return handlerResponse
		}
		power, err := strconv.Atoi(ctx.MessageText)
		if err != nil {
			ctx.CreateAndSendMessage(msg.DontRecognizePower)
			return HandlerResponse{}
		}
		if power < 1 || power > 10 {
			ctx.CreateAndSendMessage(msg.DontRecognizePower)
			return HandlerResponse{}
		}
		story.Power = uint8(power)
	}

	story.Date = helpers.GetDate()
	err := repo.CreateStory(story)
	if err != nil {
		panic(err)
	}
	_ = ctx.NewStory()
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
