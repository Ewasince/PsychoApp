package bot

import (
	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"log"
)

type BotHandler struct {
	BotApi        *tg.BotAPI
	MessageChatId int64
}

func (b *BotHandler) SendMessage(msg tg.Chattable) error {
	if _, err := b.BotApi.Send(msg); err != nil {
		log.Panic(err)
		return err
	}
	return nil
}

func (b *BotHandler) CreateMessage(text string) tg.MessageConfig {
	return tg.NewMessage(b.MessageChatId, text)
}

func (b *BotHandler) CreateAndSendMessage(text string) error {
	return b.SendMessage(b.CreateMessage(text))
}
