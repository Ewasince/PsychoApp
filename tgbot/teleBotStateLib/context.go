package teleBotStateLib

import (
	"PsychoBot/teleBotStateLib/apiUtils"
	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"log"
)

type BotContext interface {
	GetMessageCommand() string
	GetMessageText() string
	GetMessageSenderId() int64

	SendMessages(...tg.Chattable) error
	CreateMessages(...string) []tg.MessageConfig

	CreateAndSendMessage(string) error

	botError(error)
	incCallCount() uint
}

type BaseBotContext struct {
	MessageText     string
	MessageCommand  string
	MessageSenderId int64
	MessageChatId   int64
	BotHandler      apiUtils.SenderHandler
	CallCount       uint
}

func NewContext(message *tg.Message, senderHandler *apiUtils.BaseSenderHandler) *BaseBotContext {
	return &BaseBotContext{
		MessageText:     message.Text,
		MessageCommand:  message.Command(),
		MessageSenderId: message.From.ID,
		MessageChatId:   message.Chat.ID,
		BotHandler:      senderHandler,
	}
}

func (b *BaseBotContext) GetMessageCommand() string {
	return b.MessageText
}
func (b *BaseBotContext) GetMessageText() string {
	return b.MessageCommand
}
func (b *BaseBotContext) GetMessageSenderId() int64 {
	return b.MessageSenderId
}

func (b *BaseBotContext) SendMessages(chattables ...tg.Chattable) error {
	for _, msg := range chattables {
		if err := b.BotHandler.SendMessage(msg); err != nil {
			log.Panic(err)
			return err
		}
	}
	return nil
}

func (b *BaseBotContext) CreateMessages(messages ...string) []tg.MessageConfig {
	var chattableMessages []tg.MessageConfig
	for _, msg := range messages {
		chattableMessages = append(chattableMessages, tg.NewMessage(b.MessageChatId, msg))
	}
	return chattableMessages
}

func (b *BaseBotContext) CreateAndSendMessage(message string) error {
	messageConfigs := b.CreateMessages(message)
	var chattableMessages []tg.Chattable
	for _, msg := range messageConfigs {
		chattableMessages = append(chattableMessages, msg)
	}
	return b.SendMessages(chattableMessages...)
}

func (b *BaseBotContext) botError(err error) {
	_ = b.CreateAndSendMessage(err.Error())
	log.Panic(err)
}

func (b *BaseBotContext) incCallCount() uint {
	b.CallCount++
	return b.CallCount
}
