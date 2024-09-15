package stateBot

import (
	"PsychoBot/bot"
	msg "PsychoBot/messages"

	. "StorageModule/models"
	"StorageModule/repo"
	"gorm.io/gorm"
	"strconv"
)

func (s *StateHandler) ProcessState(state BotState) {
	stateMap := map[BotState]func(){
		BotStateInitial:       s.processStateInitial,
		BotStateRegister:      s.processStateRegister,
		BotStateFillSituation: s.processStateFillSituation,
		BotStateFillMind:      s.processStateFillMind,
		BotStateFillEmotion:   s.processStateFillEmotion,
		BotStateFillPower:     s.processStateFillPower,
	}
	stateMap[state]()
}
func (s *StateHandler) processStateInitial() {
	if bot.IsPatientRegistered(s.MessageSenderId) {
		_ = s.setNewStory()
		s.sendAndSetState(BotStateFillSituation, msg.MsgWhatHappened)
	} else {
		s.sendAndSetState(BotStateRegister, msg.MessageGreating, msg.MessageRegister)
	}
}
func (s *StateHandler) processStateRegister() {
	var user *User
	user, err := repo.GetUserByUsername(s.MessageText)

	if err != nil {
		_ = s.BotHandler.CreateAndSendMessage(msg.MessageUserNotFound)
		return
	}

	patient := &Patient{
		BaseModel: BaseModel{
			Model: gorm.Model{},
		},
		Name:     s.MessageSender.FirstName,
		LastName: s.MessageSender.LastName,
		Email:    "",
		Username: s.MessageSender.UserName,
		Password: "",
		UserId:   user.ID,
		TgId:     s.MessageSenderId,
	}
	err = repo.CreatePatient(patient)
	if err != nil {
		_ = s.BotHandler.CreateAndSendMessage(msg.MessageCantCreatePatient)
		return
	}

	_ = s.setNewStory()
	s.sendAndSetState(BotStateFillSituation, msg.MessageRegisterComplete)
}
func (s *StateHandler) processStateFillSituation() {
	s.Story.Situation = s.MessageText

	s.sendAndSetState(BotStateFillMind, msg.MsgWhatMind)
}
func (s *StateHandler) processStateFillMind() {
	s.Story.Mind = s.MessageText

	s.sendAndSetState(BotStateFillEmotion, msg.MsgWhatEmotion)
}
func (s *StateHandler) processStateFillEmotion() {
	s.Story.Emotion = s.MessageText

	s.sendAndSetState(BotStateFillPower, msg.MsgWhatPower)
}
func (s *StateHandler) processStateFillPower() {
	power, err := strconv.Atoi(s.MessageText)
	if err != nil {
		_ = s.BotHandler.CreateAndSendMessage(msg.MessageDontRecognizeNumber)
		return
	}
	s.Story.Power = uint8(power)

	bot.LoadStory(s.Story)
	_ = s.setNewStory()
	s.sendAndSetState(BotStateFillSituation, msg.MsgWhatEntryDone)
}
