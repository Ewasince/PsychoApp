package teleBotStateLib

import (
	"PsychoBot/teleBotStateLib/apiUtils"
	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"log"
)

type BotContext interface {
	GetMessage() *tg.Message
	SendMessages(...tg.Chattable) error
	CreateMessages(...string) []tg.MessageConfig

	CreateAndSendMessage(string) error

	botError(error)
	incCallCount() uint
}

type BaseBotContext struct {
	Message    *tg.Message
	BotHandler apiUtils.SenderHandler
	CallCount  uint
}

func NewContext(message *tg.Message, senderHandler *apiUtils.BaseSenderHandler) *BaseBotContext {
	return &BaseBotContext{
		Message:    message,
		BotHandler: senderHandler,
	}
}

func (b *BaseBotContext) GetMessage() *tg.Message {
	return b.Message
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
		chattableMessages = append(chattableMessages, tg.NewMessage(b.Message.Chat.ID, msg))
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
