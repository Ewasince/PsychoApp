package states

import (
	"PsychoApp/storage/repo"
	msg "PsychoApp/tgbot/messages"
	"PsychoApp/tgbot/stateBot/context"
	"errors"
	"fmt"
	. "github.com/Ewasince/go-telegram-state-bot/message_types"

	. "github.com/Ewasince/go-telegram-state-bot/helpers"
	. "github.com/Ewasince/go-telegram-state-bot/interfaces"
	. "github.com/Ewasince/go-telegram-state-bot/states"
	"gorm.io/gorm"
	"time"
)

var SetMoodState = NewBotState(
	"Set mood state",
	BotMessageHandler(enterMessageHandlerSetMoodState),
	TextMessage(msg.SetMoodSuccess),
	&MoodKeyboard,
	messageHandlerSetMoodState,
)

func enterMessageHandlerSetMoodState(c BotContext) (Messagables, error) {
	ctx := *c.(*context.MyBotContext)
	message := msg.SetMood
	if ctx.IsPatientRegistered() {
		now := time.Now()
		mood, err := repo.GetMood(ctx.Patient.ID, now)
		if err == nil && mood != nil {
			message += fmt.Sprintf(msg.AlreadySetMood, mood.Value)
		} else if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, err
		}
	}
	return TextMessage(message), nil
}

//	func exitMessageHandlerSetMoodState(c BotContext) ([]string, error) {
//		ctx := *c.(*context.MyBotContext)
//		scheduleHour := ctx.Patient.NextSchedule.Hour()
//		message := fmt.Sprintf(msg.SetScheduleSuccess, strconv.Itoa(scheduleHour))
//		return []string{message}, nil
//	}
func messageHandlerSetMoodState(c BotContext) HandlerResponse {
	ctx := *c.(*context.MyBotContext)
	CreateAndSendMessage(msg.SetMoodWrong, ctx)
	return HandlerResponse{}
}
