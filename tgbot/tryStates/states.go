package tryStates

import (
	msg "PsychoBot/messages"
	. "PsychoBot/teleBotStateLib"
	. "StorageModule/models"
	"StorageModule/repo"
	"errors"
	"gorm.io/gorm"
	//"log"
)

const (
	BotStateInit      BotStateId = iota
	BotStateRegister  BotStateId = iota
	BotStateFillStory BotStateId = iota
	BotStateSchedule  BotStateId = iota
)

var InitState = NewBotState(
	BotStateInit,
	nil,
	nil,
	nil,
	func(c BotContext) (HandlerResponse, error) {
		ctx := *c.(*MyBotContext)
		if ctx.IsPatientRegistered {
			return HandlerResponse{
				NextStateId:    BotStateFillStory,
				TransitionType: GoStateInPlace,
			}, nil
		} else {
			return HandlerResponse{
				NextStateId:    BotStateRegister,
				TransitionType: GoStateInPlace,
			}, nil
		}

	},
)
var RegisterState = NewBotState(
	BotStateRegister,
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
			TgId:     ctx.Message.From.ID,
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
			NextStateId:    BotStateFillStory,
			TransitionType: GoState,
		}, nil
	},
)

var FillStoryState = NewBotState(
	BotStateFillStory,
	BotMessageHandler(func(c BotContext) ([]string, error) {
		ctx := *c.(*MyBotContext)
		ctx.ResetStory()
		return []string{msg.WhatHappened}, nil
	}),
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
			TgId:     ctx.Message.From.ID,
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
			NextStateId:    BotStateFillStory,
			TransitionType: GoState,
		}, nil
	},
)
