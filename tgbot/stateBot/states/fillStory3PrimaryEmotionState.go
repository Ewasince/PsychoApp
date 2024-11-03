package states

import (
	msg "PsychoBot/messages"
	"PsychoBot/stateBot/context"
	"PsychoBot/stateBot/helpers"
	. "github.com/Ewasince/go-telegram-state-bot/message_types"

	. "github.com/Ewasince/go-telegram-state-bot/enums"
	. "github.com/Ewasince/go-telegram-state-bot/helpers"
	. "github.com/Ewasince/go-telegram-state-bot/interfaces"
	. "github.com/Ewasince/go-telegram-state-bot/keyboard"
	. "github.com/Ewasince/go-telegram-state-bot/states"
)

var EmotionsKeyboard BotKeyboard

var EmotionsStatesMap map[string]*BotState

func init() {
	EmotionsMap := map[string][]string{
		"Радость": {
			"Интерес",
			"Умиротворение",
			"Радость",
			"Удивление",
		},
		"Гнев": {
			"Гнев",
			"Обида",
			"Отвращение",
			"Зависть",
			"Презрение",
		},
		"Печаль": {
			"Печаль",
			"Сожаление",
			"Стыд",
			"Смущение",
			"Вина",
			"Безысходность",
		},
		"Страх": {
			"Страх",
			"Паника",
			"Тревога",
		},
	}

	EmotionsStatesMap = map[string]*BotState{}

	mainEmotions := make([]string, len(EmotionsMap))
	i := 0
	for mainEmotion := range EmotionsMap {
		mainEmotions[i] = mainEmotion
		i++

		emotionsFromMain := EmotionsMap[mainEmotion]

		rows := helpers.CreateArrayKeyboard(emotionsFromMain, 1, keyboardEmotionHandler)
		addBackButtonWithHandler(&rows, keyboardBackEmotionHandler)
		kb := BotKeyboard{Keyboard: rows}
		emotionSate := NewBotState(
			"Fill Story emotion state for "+mainEmotion,
			TextMessage(msg.WhatEmotion),
			nil,
			&kb,
			pleaseChooseFromListHandler,
		)

		EmotionsStatesMap[mainEmotion] = &emotionSate
	}

	rows := helpers.CreateArrayKeyboard(mainEmotions, 1, keyboardMainEmotionHandler)
	addBackButton(&rows)
	EmotionsKeyboard = BotKeyboard{Keyboard: rows}
}

var FillStoryPrimaryEmotionState = NewBotState(
	"Fill Story main emotion state",
	TextMessage(msg.WhatEmotion),
	nil,
	&EmotionsKeyboard,
	pleaseChooseFromListHandler,
)

func pleaseChooseFromListHandler(c BotContext) HandlerResponse {
	ctx := c.(*context.MyBotContext)
	CreateAndSendMessage(msg.WhatEmotionError, ctx)
	return HandlerResponse{}
}

func keyboardEmotionHandler(c BotContext) HandlerResponse {
	ctx := c.(*context.MyBotContext)

	story := ctx.GetStory()
	story.Emotion = ctx.MessageText

	return HandlerResponse{
		NextState:      &FillStoryPowerState,
		TransitionType: GoState,
	}
}
func keyboardBackEmotionHandler(_ BotContext) HandlerResponse {
	return HandlerResponse{
		NextState:      &FillStoryPrimaryEmotionState,
		TransitionType: GoStateForce,
	}
}

func keyboardMainEmotionHandler(c BotContext) HandlerResponse {
	ctx := c.(*context.MyBotContext)

	newState, exists := EmotionsStatesMap[ctx.MessageText]
	if !exists {
		panic("no such emotion group")
	}

	return HandlerResponse{
		NextState:      newState,
		TransitionType: GoState,
	}
}
