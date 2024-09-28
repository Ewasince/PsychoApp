package states

import (
	"PsychoBot/bot"
	msg "PsychoBot/messages"
	. "PsychoBot/teleBotStateLib"
	"PsychoBot/tryStates"
	"PsychoBot/tryStates/helpers"
	"errors"
	"fmt"
	"strconv"
)

var FillScheduleState = newBotStateWrapper(
	"Fill Schedule state",
	BotMessageHandler(enterMessageHandlerFillScheduleState),
	BotMessageHandler(exitMessageHandlerFillScheduleState),
	nil,
	messageHandlerFillScheduleState,
)

func enterMessageHandlerFillScheduleState(c BotContext) ([]string, error) {
	ctx := *c.(*tryStates.MyBotContext)
	var message string
	if ctx.Patient.NextSchedule != nil {
		message = fmt.Sprintf(msg.SetScheduleSet, ctx.Patient.NextSchedule.Hour())
	} else {
		message = msg.SetScheduleNotSet
	}
	return []string{message}, nil
}

func exitMessageHandlerFillScheduleState(c BotContext) ([]string, error) {
	ctx := *c.(*tryStates.MyBotContext)
	scheduleHour := ctx.Patient.NextSchedule.Hour()
	message := fmt.Sprintf(msg.SetScheduleSuccess, strconv.Itoa(scheduleHour))
	return []string{message}, nil
}
func messageHandlerFillScheduleState(c BotContext) (HandlerResponse, error) {
	ctx := *c.(*tryStates.MyBotContext)

	scheduleHour, err := strconv.Atoi(ctx.MessageText)
	if err != nil {
		_ = ctx.CreateAndSendMessage(msg.DontRecognizeHour)
		return HandlerResponse{}, nil
	}
	if !ctx.IsPatientRegistered() {
		return HandlerResponse{}, errors.New("no patient provided")
	}
	if !(0 <= scheduleHour && scheduleHour <= 23) {
		_ = ctx.CreateAndSendMessage(msg.DontRecognizeHour)
		return HandlerResponse{}, nil
	}
	nextSchedule := helpers.GetScheduleTime(scheduleHour)
	ctx.Patient.NextSchedule = &nextSchedule
	ctx.Patient.TgChatId = &ctx.Message.Chat.ID
	err = bot.SaveSchedule(ctx.Patient)
	if err != nil {
		return HandlerResponse{}, err
	}

	return HandlerResponse{
		NextState:      &FillStoryState,
		TransitionType: GoState,
	}, nil
}
