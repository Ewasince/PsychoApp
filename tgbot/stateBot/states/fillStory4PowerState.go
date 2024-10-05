package states

import (
	msg "PsychoBot/messages"
	"PsychoBot/stateBot/context"
	"PsychoBot/stateBot/helpers"
	"StorageModule/repo"
	. "github.com/Ewasince/go-telegram-state-bot"
	"strconv"
)

var PowerKeyboard BotKeyboard

func init() {
	emotionPowers := helpers.MakeRangeStr(1, 10)
	rows := helpers.CreateArrayKeyboard(emotionPowers, 0, keyboardHandlerFillStoryPowerState)
	addBackButton(&rows)
	PowerKeyboard = BotKeyboard{Keyboard: rows}
}

var FillStoryPowerState = NewBotState(
	"Fill Story mind state",
	BotMessages{msg.WhatPower},
	BotMessages{msg.WhatEntryDone},
	&PowerKeyboard,
	nil,
)

func keyboardHandlerFillStoryPowerState(c BotContext) HandlerResponse {
	ctx := c.(*context.MyBotContext)

	power, err := strconv.Atoi(ctx.MessageText)
	if err != nil {
		ctx.CreateAndSendMessage(msg.DontRecognizePower)
		return HandlerResponse{}
	}
	if power < 1 || power > 10 {
		ctx.CreateAndSendMessage(msg.DontRecognizePower)
		return HandlerResponse{}
	}
	story := ctx.GetStory()

	story.Power = uint8(power)

	story.Date = helpers.GetDate()
	err = repo.CreateStory(story)
	if err != nil {
		panic(err)
	}
	_ = ctx.NewStory()
	return HandlerResponse{
		NextState:      DefaultState,
		TransitionType: GoState,
	}
}
