package context

import (
	"PsychoBot/cache"
	msg "PsychoBot/messages"
	"StorageModule/models"
	"StorageModule/repo"
	"errors"
	tl "github.com/Ewasince/go-telegram-state-bot"
	"github.com/Ewasince/go-telegram-state-bot/apiUtils"
	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"gorm.io/gorm"
)

type MyBotContext struct {
	*tl.BaseBotContext
	Patient       *models.Patient
	PatientTgId   int64
	MessageSender *tg.User
}

func NewMyBotContext(
	message *tg.Message,
	senderHandler *apiUtils.BaseSenderHandler,
	errorMessage string,
) *MyBotContext {
	patientTgId := message.From.ID
	currentPatient, err := repo.GetPatientByTg(patientTgId)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		panic(err)
	}
	return &MyBotContext{
		BaseBotContext: &tl.BaseBotContext{
			MessageText:     message.Text,
			MessageCommand:  message.Command(),
			MessageSenderId: message.From.ID,
			MessageChatId:   message.Chat.ID,
			BotHandler:      senderHandler,
			ErrorMessage:    errorMessage,
		},
		Patient:       currentPatient,
		PatientTgId:   patientTgId,
		MessageSender: message.From,
	}
}

func (c *MyBotContext) GetStory() *models.Story {
	story := cache.GetStory(c.MessageSenderId)
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
func (c *MyBotContext) IsPatientRegistered() bool {
	return c.Patient.ID != 0
}
func (c *MyBotContext) SendErrorMessage() {
	c.CreateAndSendMessage(msg.BotError)
}
