package states

import (
	msg "PsychoBot/messages"
	"PsychoBot/stateBot/context"
	"PsychoBot/stateBot/helpers"
	. "PsychoBot/teleBotStateLib"
	"StorageModule/repo"
	"fmt"
	"strconv"
)

var FillScheduleState = NewBotState(
	"Fill Schedule state",
	BotMessageHandler(enterMessageHandlerFillScheduleState),
	BotMessageHandler(exitMessageHandlerFillScheduleState),
	nil,
	messageHandlerFillScheduleState,
)

func enterMessageHandlerFillScheduleState(c BotContext) ([]string, error) {
	ctx := *c.(*context.MyBotContext)
	var message string
	if ctx.Patient.NextSchedule != nil {
		message = fmt.Sprintf(msg.SetScheduleSet, ctx.Patient.NextSchedule.Hour())
	} else {
		message = msg.SetScheduleNotSet
	}
	return []string{message}, nil
}

func exitMessageHandlerFillScheduleState(c BotContext) ([]string, error) {
	ctx := *c.(*context.MyBotContext)
	scheduleHour := ctx.Patient.NextSchedule.Hour()
	message := fmt.Sprintf(msg.SetScheduleSuccess, strconv.Itoa(scheduleHour))
	return []string{message}, nil
}
func messageHandlerFillScheduleState(c BotContext) HandlerResponse {
	ctx := *c.(*context.MyBotContext)

	scheduleHour, err := strconv.Atoi(ctx.MessageText)
	if err != nil {
		ctx.CreateAndSendMessage(msg.DontRecognizeHour)
		return HandlerResponse{}
	}
	if !ctx.IsPatientRegistered() {
		panic("no patient provided")
	}
	if !(0 <= scheduleHour && scheduleHour <= 23) {
		ctx.CreateAndSendMessage(msg.DontRecognizeHour)
		return HandlerResponse{}
	}

	return FillSchedule(c, scheduleHour)
}

func FillSchedule(c BotContext, scheduleHour int) HandlerResponse {
	ctx := *c.(*context.MyBotContext)

	nextSchedule := helpers.GetScheduleTime(scheduleHour)
	ctx.Patient.NextSchedule = &nextSchedule
	ctx.Patient.TgChatId = &ctx.MessageChatId
	err := repo.UpdateSchedule(ctx.Patient)
	if err != nil {
		panic(err)
	}

	return HandlerResponse{
		NextState:      DefaultState,
		TransitionType: GoState,
	}
}
