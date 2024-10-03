package states

import (
	msg "PsychoBot/messages"
	"PsychoBot/stateBot/context"
	. "PsychoBot/teleBotStateLib"
	. "StorageModule/models"
	"StorageModule/repo"
	"errors"
	"gorm.io/gorm"
)

var RegisterState = NewBotState(
	"Register state",
	&BotMessages{msg.Greeting, msg.Register},
	BotMessageHandler(exitMessageHandlerRegisterState),
	nil,
	messageHandlerRegisterState,
)

func exitMessageHandlerRegisterState(c BotContext) ([]string, error) {
	ctx := *c.(*context.MyBotContext)
	if ctx.IsPatientRegistered() {
		ctx.CreateAndSendMessage(msg.CantCreatePatient)
		return []string{}, errors.New("patient was complete register, but wasn't registered ")
	}
	return []string{msg.RegisterComplete}, nil
}

func messageHandlerRegisterState(c BotContext) HandlerResponse {
	ctx := *c.(*context.MyBotContext)

	var user *User
	user, err := repo.GetUserByUsername(ctx.MessageText)

	if err != nil && errors.Is(err, gorm.ErrRecordNotFound) {
		ctx.CreateAndSendMessage(msg.UserNotFound)
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
		ctx.CreateAndSendMessage(msg.CantCreatePatient)
		return HandlerResponse{}
	}
	ctx.Patient = patient
	return HandlerResponse{
		NextState:      DefaultState,
		TransitionType: GoState,
	}
}
