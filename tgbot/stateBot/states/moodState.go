package states

import (
	msg "PsychoBot/messages"
	"PsychoBot/stateBot/context"
	. "PsychoBot/teleBotStateLib"
	"StorageModule/repo"
	"errors"
	"fmt"
	"gorm.io/gorm"
	"time"
)

var SetMoodState = NewBotState(
	"Set mood state",
	BotMessageHandler(enterMessageHandlerSetMoodState),
	BotMessages{msg.SetMoodSuccess},
	&MoodKeyboard,
	messageHandlerSetMoodState,
)

func enterMessageHandlerSetMoodState(c BotContext) ([]string, error) {
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
	return []string{message}, nil
}

//	func exitMessageHandlerSetMoodState(c BotContext) ([]string, error) {
//		ctx := *c.(*context.MyBotContext)
//		scheduleHour := ctx.Patient.NextSchedule.Hour()
//		message := fmt.Sprintf(msg.SetScheduleSuccess, strconv.Itoa(scheduleHour))
//		return []string{message}, nil
//	}
func messageHandlerSetMoodState(c BotContext) HandlerResponse {
	ctx := *c.(*context.MyBotContext)
	ctx.CreateAndSendMessage(msg.SetMoodWrong)
	return HandlerResponse{}
}
