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
	Patient     *models.Patient
	MessageText string
	PatientTgId int64
}

func NewMyBotContext(message *tg.Message, senderHandler *apiUtils.BaseSenderHandler) (*MyBotContext, error) {
	patientTgId := message.From.ID
	currentPatient, err := repo.GetPatientByTg(patientTgId)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}
	return &MyBotContext{
		BaseBotContext: &tl.BaseBotContext{
			Message:    message,
			BotHandler: senderHandler,
		},
		Patient:     currentPatient,
		MessageText: message.Text,
		PatientTgId: patientTgId,
	}, nil
}

func (c *MyBotContext) GetStory() *models.Story {
	story := cache.GetStory(c.Message.From.ID)
	if story == nil {
		return c.NewStory()
	}
	return story
}
func (c *MyBotContext) NewStory() *models.Story {
	newStory := cache.ResetStory(c.PatientTgId)
	newStory.PatientId = c.Patient.ID
	return newStory
}
