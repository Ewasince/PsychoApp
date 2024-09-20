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
		s.sendAndSetState(BotStateFillSituation, msg.WhatHappened)
	} else {
		s.sendAndSetState(BotStateRegister, msg.Greating, msg.Register)
	}
}
func (s *StateHandler) processStateRegister() {
	var user *User
	user, err := repo.GetUserByUsername(s.MessageText)

	if err != nil {
		_ = s.BotHandler.CreateAndSendMessage(msg.UserNotFound)
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
		_ = s.BotHandler.CreateAndSendMessage(msg.CantCreatePatient)
		return
	}

	_ = s.setNewStory()
	s.sendAndSetState(BotStateFillSituation, msg.RegisterComplete)
}
func (s *StateHandler) processStateFillSituation() {
	s.Story.Situation = s.MessageText

	s.sendAndSetState(BotStateFillMind, msg.WhatMind)
}
func (s *StateHandler) processStateFillMind() {
	s.Story.Mind = s.MessageText

	s.sendAndSetState(BotStateFillEmotion, msg.WhatEmotion)
}
func (s *StateHandler) processStateFillEmotion() {
	s.Story.Emotion = s.MessageText

	s.sendAndSetState(BotStateFillPower, msg.WhatPower)
}
func (s *StateHandler) processStateFillPower() {
	power, err := strconv.Atoi(s.MessageText)
	if err != nil {
		_ = s.BotHandler.CreateAndSendMessage(msg.DontRecognizePower)
		return
	}
	s.Story.Power = uint8(power)

	err = bot.LoadStory(s.Story)
	if err != nil {
		_ = s.BotHandler.CreateAndSendMessage(msg.CantSaveStory)

	}
	_ = s.setNewStory()
	s.sendAndSetState(BotStateFillSituation, msg.WhatEntryDone)
}
