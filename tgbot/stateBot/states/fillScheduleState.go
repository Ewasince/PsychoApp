package states

import (
	"PsychoApp/storage/repo"
	msg "PsychoApp/tgbot/messages"
	"PsychoApp/tgbot/stateBot/context"
	"PsychoApp/tgbot/stateBot/helpers"
	"fmt"
	. "github.com/Ewasince/go-telegram-state-bot/enums"
	. "github.com/Ewasince/go-telegram-state-bot/helpers"
	. "github.com/Ewasince/go-telegram-state-bot/interfaces"
	. "github.com/Ewasince/go-telegram-state-bot/message_types"
	. "github.com/Ewasince/go-telegram-state-bot/states"
	"strconv"
)

var FillScheduleState = NewBotState(
	"Fill Schedule state",
	BotMessageHandler(enterMessageHandlerFillScheduleState),
	BotMessageHandler(exitMessageHandlerFillScheduleState),
	&ScheduleKeyboard,
	messageHandlerFillScheduleState,
)

func enterMessageHandlerFillScheduleState(c BotContext) (Messagables, error) {
	ctx := *c.(*context.MyBotContext)
	var message string
	if ctx.Patient.NextSchedule != nil {
		message = fmt.Sprintf(msg.SetScheduleSet, ctx.Patient.NextSchedule.Hour())
	} else {
		message = msg.SetScheduleNotSet
	}
	return TextMessage(message), nil
}

func exitMessageHandlerFillScheduleState(c BotContext) (Messagables, error) {
	ctx := *c.(*context.MyBotContext)
	scheduleHour := ctx.Patient.NextSchedule.Hour()
	message := fmt.Sprintf(msg.SetScheduleSuccess, strconv.Itoa(scheduleHour))
	return TextMessage(message), nil
}
func messageHandlerFillScheduleState(c BotContext) HandlerResponse {
	ctx := *c.(*context.MyBotContext)

	scheduleHour, err := strconv.Atoi(ctx.MessageText)
	if err != nil {
		CreateAndSendMessage(msg.DontRecognizeHour, ctx)
		return HandlerResponse{}
	}
	if !ctx.IsPatientRegistered() {
		panic("no patient provided")
	}
	if !(0 <= scheduleHour && scheduleHour <= 23) {
		CreateAndSendMessage(msg.DontRecognizeHour, ctx)
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
