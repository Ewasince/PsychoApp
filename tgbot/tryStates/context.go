package tryStates

import (
	"PsychoBot/cache"
	tl "PsychoBot/teleBotStateLib"
	"PsychoBot/teleBotStateLib/apiUtils"
	"StorageModule/models"
	"StorageModule/repo"
	"errors"
	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"gorm.io/gorm"
)

type MyBotContext struct {
	*tl.BaseBotContext
	Patient             *models.Patient
	IsPatientRegistered bool
	MessageText         string
}

func NewMyBotContext(message *tg.Message, senderHandler *apiUtils.BaseSenderHandler) (*MyBotContext, error) {
	currentPatient, err := repo.GetPatientByTg(message.From.ID)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}
	return &MyBotContext{
		BaseBotContext: &tl.BaseBotContext{
			Message:    message,
			BotHandler: senderHandler,
		},
		Patient:             currentPatient,
		IsPatientRegistered: !errors.Is(err, gorm.ErrRecordNotFound),
		MessageText:         message.Text,
	}, nil
}

func (c *MyBotContext) GetStory() *models.Story {
	return cache.GetStory(c.Message.From.ID)
}
func (c *MyBotContext) ResetStory() *models.Story {
	return cache.ResetStory(c.Message.From.ID)
}
