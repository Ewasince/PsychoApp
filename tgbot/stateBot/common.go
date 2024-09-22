package stateBot

import (
	"PsychoBot/bot"
	msg "PsychoBot/messages"
	"StorageModule/models"
	"StorageModule/repo"
	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"gorm.io/gorm"
	"log"
	"time"
)

type StateHandler struct {
	MessageCommand        string
	MessageText           string
	MessageSender         *tg.User
	MessageSenderId       int64
	MessageSenderUserName string
	MessageChatId         int64
	BotHandler            bot.Handler
	Story                 *models.Story
}

func NewStateHandler(
	message *tg.Message,
	botAPI *tg.BotAPI,
) *StateHandler {
	messageCommand := message.Command()
	messageText := message.Text
	messageSender := message.From
	messageSenderUserName := messageSender.UserName
	messageSenderId := messageSender.ID
	messageChatId := message.Chat.ID

	stateHandler := StateHandler{
		MessageCommand:        messageCommand,
		MessageText:           messageText,
		MessageSender:         messageSender,
		MessageSenderId:       messageSenderId,
		MessageSenderUserName: messageSenderUserName,
		MessageChatId:         messageChatId,
		BotHandler: bot.Handler{
			BotApi:        botAPI,
			MessageChatId: messageChatId,
		},
	}

	story, exists := bot.StoriesCache[messageSenderId]
	if !exists {
		_ = stateHandler.setNewStory()
	} else {
		stateHandler.Story = story
	}
	return &stateHandler
}

func (s *StateHandler) setNewStory() error {
	patient, err := repo.GetPatientByTg(s.MessageSenderId)
	if err != nil {
		return err
	}
	story := &models.Story{
		BaseModel: models.BaseModel{
			Model: gorm.Model{},
		},
		PatientId: patient.ID,
	}
	bot.StoriesCache[s.MessageSenderId] = story
	s.Story = story
	return nil
}

func (s *StateHandler) setState(state BotState, messages ...string) {
	messagesBeforeNewState, err := s.getMessageBeforeState(state)
	if err != nil {
		s.botError(err)
		return
	}

	if messagesBeforeNewState != nil {
		messages = append(messages, *messagesBeforeNewState...)
	}

	for _, message := range messages {
		err := s.BotHandler.CreateAndSendMessage(message)
		if err != nil {
			return
		}
	}

	setCacheState(s.MessageSenderId, state)
}

func (s *StateHandler) botError(err error) {
	_ = s.BotHandler.CreateAndSendMessage(msg.BotError)
	log.Panic(err)
}

func getScheduleTime(scheduleHour int) time.Time {
	now := time.Now().Truncate(time.Hour)
	scheduleInHours := scheduleHour - now.Hour()
	if scheduleInHours < 0 {
		scheduleInHours = scheduleInHours + 24
	}

	return now.Add(time.Hour * time.Duration(scheduleInHours))
}
