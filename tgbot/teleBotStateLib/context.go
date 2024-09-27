package teleBotStateLib

import (
	"PsychoBot/bot"
	"StorageModule/models"
	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

//type BotContext struct {
//	MessageCommand        string
//	MessageText           string
//	MessageSender         *tg.User
//	MessageSenderId       int64
//	MessageSenderUserName string
//	MessageChatId         int64
//	BotHandler            bot.Handler
//	Story                 *models.Story
//}
//
//
//func (b *BotContext) SendMessage(msg tg.Chattable) error {
//	b.BotApiMutex.Lock()
//	defer b.BotApiMutex.Unlock()
//
//	if _, err := b.BotApi.Send(msg); err != nil {
//		log.Panic(err)
//		return err
//	}
//	return nil
//}
//
//func (b *BotContext) CreateMessage(text string) tg.MessageConfig {
//	return tg.NewMessage(b.MessageChatId, text)
//}
//
//func (b *BotContext) CreateAndSendMessage(text string) error {
//	return b.SendMessage(b.CreateMessage(text))
//}

type BotContext interface {
	GetMessage() tg.Message
	SendMessages(...tg.Chattable) error
	CreateMessages(...string) []tg.MessageConfig

	CreateAndSendMessage(string) error

	SetState(BotStateId) error
	GetState() BotStateId

	botError(error)
}
