package context

import (
	"PsychoApp/storage/models"
	"PsychoApp/storage/repo"
	"PsychoApp/tgbot/cache"
	msg "PsychoApp/tgbot/messages"
	"errors"
	"github.com/Ewasince/go-telegram-state-bot/api_utils"
	tl "github.com/Ewasince/go-telegram-state-bot/context"
	"github.com/Ewasince/go-telegram-state-bot/helpers"
	"github.com/Ewasince/go-telegram-state-bot/interfaces"

	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"gorm.io/gorm"
)

var _ interfaces.BotContext = (*MyBotContext)(nil) // interface hint

type MyBotContext struct {
	*tl.BaseBotContext
	Patient       *models.Patient
	PatientTgId   int64
	MessageSender *tg.User
}

func NewMyBotContext(
	message *tg.Message,
	senderHandler *api_utils.BaseSenderHandler,
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
	helpers.CreateAndSendMessage(msg.BotError, c)
}
