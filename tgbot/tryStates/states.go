package tryStates

import (
	msg "PsychoBot/messages"
	. "PsychoBot/teleBotStateLib"
	. "StorageModule/models"
	"StorageModule/repo"
	"errors"
	"gorm.io/gorm"
	"strconv"
	"time"
)

var statesList []BotState

var InitState = newBotStateWrapper(
	"Init state",
	nil,
	nil,
	nil,
	func(c BotContext) (HandlerResponse, error) {
		ctx := *c.(*MyBotContext)
		if ctx.IsPatientRegistered {
			return HandlerResponse{
				NextState:      &FillStoryState,
				TransitionType: GoStateInPlace,
			}, nil
		} else {
			return HandlerResponse{
				NextState:      &RegisterState,
				TransitionType: GoStateInPlace,
			}, nil
		}

	},
)
var RegisterState = newBotStateWrapper(
	"Register state",
	&BotMessages{msg.Greeting, msg.Register},
	nil,
	nil,
	func(c BotContext) (HandlerResponse, error) {
		ctx := *c.(*MyBotContext)

		var user *User
		user, err := repo.GetUserByUsername(ctx.MessageText)

		if err != nil && errors.Is(err, gorm.ErrRecordNotFound) {
			_ = ctx.CreateAndSendMessage(msg.UserNotFound)
			return HandlerResponse{}, nil
		}
		if err != nil {
			return HandlerResponse{}, err
		}

		patient := &Patient{
			BaseModel: BaseModel{
				Model: gorm.Model{},
			},
			Name:     ctx.Message.From.FirstName,
			LastName: ctx.Message.From.LastName,
			Email:    "",
			Username: ctx.Message.From.UserName,
			Password: "",
			UserId:   user.ID,
			TgId:     ctx.PatientTgId,
			TgChatId: &ctx.Message.Chat.ID,
		}
		err = repo.CreatePatient(patient)
		if err != nil {
			_ = ctx.CreateAndSendMessage(msg.CantCreatePatient)
			return HandlerResponse{}, nil
		}

		err = ctx.CreateAndSendMessage(msg.RegisterComplete)
		if err != nil {
			return HandlerResponse{}, nil
		}

		return HandlerResponse{
			NextState:      &FillStoryState,
			TransitionType: GoState,
		}, nil
	},
)

var FillStoryState = newBotStateWrapper(
	"Fill story state",
	BotMessageHandler(func(c BotContext) ([]string, error) {
		ctx := *c.(*MyBotContext)
		ctx.NewStory()
		return []string{msg.WhatHappened}, nil
	}),
	nil,
	nil,
	func(c BotContext) (HandlerResponse, error) {
		ctx := *c.(*MyBotContext)

		story := ctx.GetStory()

		if story.Situation == "" {
			story.Situation = ctx.MessageText
			_ = ctx.CreateAndSendMessage(msg.WhatMind)
			return HandlerResponse{}, nil
		} else if story.Mind == "" {
			story.Mind = ctx.MessageText
			_ = ctx.CreateAndSendMessage(msg.WhatEmotion)
			return HandlerResponse{}, nil
		} else if story.Emotion == "" {
			story.Emotion = ctx.MessageText
			_ = ctx.CreateAndSendMessage(msg.WhatPower)
			return HandlerResponse{}, nil
		} else if story.Power == 0 {
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

		story.Date = getDate()
		err := repo.CreateStory(story)

		if err != nil {
			_ = ctx.CreateAndSendMessage(msg.CantSaveStory)
			return HandlerResponse{}, nil
		}
		_ = ctx.CreateAndSendMessage(msg.WhatEntryDone)
		_ = ctx.NewStory()
		return HandlerResponse{
			NextState:      nil,
			TransitionType: ReloadState,
		}, nil
	},
)

func newBotStateWrapper(
	BotStateName string,
	MessageEnter StringifyArray,
	MessageExit StringifyArray,
	Keyboard *BotKeyboard,
	Handler ContextHandler,
) BotState {
	newState := NewBotState(
		//BotStateId,
		BotStateName,
		MessageEnter,
		MessageExit,
		Keyboard,
		Handler,
	)
	statesList = append(statesList, newState)
	return newState
}

func getDate() time.Time {
	return time.Now().Truncate(time.Minute)
}
