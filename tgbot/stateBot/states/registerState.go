package states

import (
	msg "PsychoBot/messages"
	"PsychoBot/stateBot/context"
	. "StorageModule/models"
	"StorageModule/repo"
	"errors"
	. "github.com/Ewasince/go-telegram-state-bot/enums"
	. "github.com/Ewasince/go-telegram-state-bot/helpers"
	. "github.com/Ewasince/go-telegram-state-bot/interfaces"
	. "github.com/Ewasince/go-telegram-state-bot/message_types"
	. "github.com/Ewasince/go-telegram-state-bot/states"
	"gorm.io/gorm"
)

var RegisterState = NewBotState(
	"Register state",
	&BotMessages{TextMessage(msg.Greeting), TextMessage(msg.Register)},
	BotMessageHandler(exitMessageHandlerRegisterState),
	nil,
	messageHandlerRegisterState,
)

func exitMessageHandlerRegisterState(c BotContext) (Messagables, error) {
	ctx := *c.(*context.MyBotContext)
	if ctx.IsPatientRegistered() {
		CreateAndSendMessage(msg.CantCreatePatient, ctx)
		return nil, errors.New("patient was complete register, but wasn't registered ")
	}
	return TextMessage(msg.RegisterComplete), nil
}

func messageHandlerRegisterState(c BotContext) HandlerResponse {
	ctx := *c.(*context.MyBotContext)

	var user *User
	user, err := repo.GetUserByUsername(ctx.MessageText)

	if err != nil && errors.Is(err, gorm.ErrRecordNotFound) {
		CreateAndSendMessage(msg.UserNotFound, ctx)
		return HandlerResponse{}
	}
	if err != nil {
		panic(err)
	}

	patient := &Patient{
		BaseModel: BaseModel{
			Model: gorm.Model{},
		},
		Name:     ctx.MessageSender.FirstName,
		LastName: ctx.MessageSender.LastName,
		Email:    "",
		Username: ctx.MessageSender.UserName,
		Password: "",
		UserId:   user.ID,
		TgId:     ctx.PatientTgId,
		TgChatId: &ctx.MessageChatId,
	}
	err = repo.CreatePatient(patient)
	if err != nil {
		CreateAndSendMessage(msg.CantCreatePatient, ctx)
		return HandlerResponse{}
	}
	ctx.Patient = patient
	return HandlerResponse{
		NextState:      &HelpState,
		TransitionType: GoState,
	}
}
