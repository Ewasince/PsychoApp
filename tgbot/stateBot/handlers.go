package stateBot

import (
	"PsychoBot/bot"
	msg "PsychoBot/messages"
	. "StorageModule/models"
	"StorageModule/repo"
	"fmt"
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
		BotStateStartSchedule: s.processStateStartSchedule,
		BotStateFillSchedule:  s.processStateFillSchedule,
		BotStateResetSchedule: s.processStateResetSchedule,
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
		TgChatId: &s.MessageChatId,
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
		return
	}
	_ = s.setNewStory()
	s.sendAndSetState(BotStateFillSituation, msg.WhatEntryDone)
}
func (s *StateHandler) processStateStartSchedule() {
	patient, err := repo.GetPatientByTg(s.MessageSenderId)
	if err != nil {
		s.botError(err)
		return
	}

	var message string
	if patient.NextSchedule != nil {
		message = fmt.Sprintf(msg.SetScheduleSet, patient.NextSchedule.Hour())
	} else {
		message = msg.SetScheduleNotSet
	}
	s.sendAndSetState(BotStateFillSchedule, message)
}
func (s *StateHandler) processStateFillSchedule() {
	scheduleHour, err := strconv.Atoi(s.MessageText)
	if err != nil {
		_ = s.BotHandler.CreateAndSendMessage(msg.DontRecognizeHour)
		return
	}
	patient, err := repo.GetPatientByTg(s.MessageSenderId)
	if err != nil {
		s.botError(err)
		return
	}
	if !(0 <= scheduleHour && scheduleHour <= 23) {
		_ = s.BotHandler.CreateAndSendMessage(msg.DontRecognizeHour)
		return
	}
	nextSchedule := getScheduleTime(scheduleHour)
	err = bot.SaveSchedule(&Patient{
		BaseModel:    BaseModel{Model: gorm.Model{ID: patient.ID}},
		NextSchedule: &nextSchedule,
		TgChatId:     &s.MessageChatId,
	})
	if err != nil {
		s.botError(err)
		return
	}
	message := fmt.Sprintf(msg.SetScheduleSuccess, strconv.Itoa(scheduleHour))
	s.sendAndSetState(BotStateInitial, message)
}
func (s *StateHandler) processStateResetSchedule() {
	patient, err := repo.GetPatientByTg(s.MessageSenderId)
	if err != nil {
		s.botError(err)
		return
	}
	err = bot.SaveSchedule(&Patient{
		BaseModel:    BaseModel{Model: gorm.Model{ID: patient.ID}},
		NextSchedule: nil,
	})
	patient, err = repo.GetPatientByTg(s.MessageSenderId)
	s.sendAndSetState(BotStateInitial, msg.ResetScheduleSuccess)
}
