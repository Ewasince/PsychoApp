package stateBot

import (
	"PsychoBot/bot"
	"StorageModule/models"
	"StorageModule/repo"
	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"gorm.io/gorm"
	"time"
)

type StateHandler struct {
	MessageCommand        string
	MessageText           string
	MessageSender         *tg.User
	MessageSenderId       int64
	MessageSenderUserName string
	MessageChatId         int64
	BotHandler            bot.BotHandler
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
		BotHandler: bot.BotHandler{
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
		Date:      getDate(),
		PatientId: patient.ID,
	}
	bot.StoriesCache[s.MessageSenderId] = story
	s.Story = story
	return nil
}

func (s *StateHandler) setState(state BotState) {
	StatesCache[s.MessageSenderId] = state
}
func (s *StateHandler) sendAndSetState(state BotState, messages ...string) {
	for _, message := range messages {
		err := s.BotHandler.CreateAndSendMessage(message)
		if err != nil {
			return
		}
	}
	s.setState(state)
}

func getDate() time.Time {
	return time.Now().Truncate(time.Minute)
}
