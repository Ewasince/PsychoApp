package states

import (
	msg "PsychoBot/messages"
	"PsychoBot/stateBot/context"
	"PsychoBot/stateBot/helpers"
	. "PsychoBot/teleBotStateLib"
	"StorageModule/repo"
	"strconv"
)

var FillStoryState = newBotStateWrapper(
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
func messageHandlerFillStoryState(c BotContext) (HandlerResponse, error) {
	ctx := c.(*context.MyBotContext)

	story := ctx.GetStory()

	if story.Situation == "" {
		story.Situation = ctx.MessageText
		_ = ctx.CreateAndSendMessage(msg.WhatMind)
		return HandlerResponse{}, nil
	} else if story.Mind == "" {
		story.Mind = ctx.MessageText
		ctx.SetKeyboard(MoodKeyboard)
		_ = ctx.CreateAndSendMessage(msg.WhatEmotion)
		return HandlerResponse{}, nil
	} else if story.Emotion == "" {
		handlerResponse, shouldRerun, err := processKeyboard(ctx, MoodKeyboard)
		if shouldRerun {
			return handlerResponse, err
		}
		story.Emotion = ctx.MessageText
		ctx.SetKeyboard(PowerKeyboard)
		_ = ctx.CreateAndSendMessage(msg.WhatPower)
		return HandlerResponse{}, nil
	} else if story.Power == 0 {
		handlerResponse, shouldRerun, err := processKeyboard(ctx, PowerKeyboard)
		if shouldRerun {
			return handlerResponse, err
		}
		power, err := strconv.Atoi(ctx.MessageText)
		if err != nil {
			_ = ctx.CreateAndSendMessage(msg.DontRecognizePower)
			return HandlerResponse{}, nil
		}
		if power < 1 || power > 10 {
			_ = ctx.CreateAndSendMessage(msg.DontRecognizePower)
			return HandlerResponse{}, nil
		}
		story.Power = uint8(power)
	}

	story.Date = helpers.GetDate()
	err := repo.CreateStory(story)

	if err != nil {
		_ = ctx.CreateAndSendMessage(msg.CantSaveStory)
		return HandlerResponse{}, nil
	}
	_ = ctx.NewStory()
	return HandlerResponse{
		NextState:      nil,
		TransitionType: ReloadState,
	}, nil
}

func processKeyboard(ctx *context.MyBotContext, kb *BotKeyboard) (HandlerResponse, bool, error) {
	handlerResponse, isButtonPressed, err := kb.ProcessMessage(ctx)
	if err != nil {
		return HandlerResponse{}, true, err
	}
	if !isButtonPressed {
		ctx.SetKeyboard(MoodKeyboard)
		err = ctx.CreateAndSendMessage(msg.WhatEmotionError)
		return HandlerResponse{}, true, err
	}
	if handlerResponse.TransitionType == GoStateForce {
		return handlerResponse, true, nil
	}
	return HandlerResponse{}, false, err
}
