package bot

import (
	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"log"
	"sync"
)

type Handler struct {
	BotApi        *tg.BotAPI
	MessageChatId int64
	BotApiMutex   sync.Mutex
}

func (b *Handler) SendMessage(msg tg.Chattable) error {
	b.BotApiMutex.Lock()
	defer b.BotApiMutex.Unlock()

	if _, err := b.BotApi.Send(msg); err != nil {
		log.Panic(err)
		return err
	}
	return nil
}

func (b *Handler) CreateMessage(text string) tg.MessageConfig {
	return tg.NewMessage(b.MessageChatId, text)
}

func (b *Handler) CreateAndSendMessage(text string) error {
	return b.SendMessage(b.CreateMessage(text))
}
