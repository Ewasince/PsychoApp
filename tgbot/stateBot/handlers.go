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

func (s *StateHandler) ProcessState() {
	state := getCacheState(s.MessageSenderId)
	stateMap := map[BotState]func(){
		BotStateInitial:       s.processStateInitial,
		BotStateRegister:      s.processStateRegister,
		BotStateFillSituation: s.processStateFillSituation,
		BotStateFillMind:      s.processStateFillMind,
		BotStateFillEmotion:   s.processStateFillEmotion,
		BotStateFillPower:     s.processStateFillPower,
		BotStateFillSchedule:  s.processStateFillSchedule,
	}
	stateMap[state]()
}

// // processStateInitial is abstract handler that servers as proxy to other handlers
//
//	func (s *StateHandler) processStateInitial() {
//		if bot.IsPatientRegistered(s.MessageSenderId) {
//			_ = s.setNewStory()
//			s.processStateFillSituation()
//		} else {
//			s.processStateRegister()
//		}
//	}
//
//	func (s *StateHandler) processStateRegister() {
//		var user *User
//		user, err := repo.GetUserByUsername(s.MessageText)
//
//		if err != nil {
//			_ = s.BotHandler.CreateAndSendMessage(msg.UserNotFound)
//			return
//		}
//
//		patient := &Patient{
//			BaseModel: BaseModel{
//				Model: gorm.Model{},
//			},
//			Name:     s.MessageSender.FirstName,
//			LastName: s.MessageSender.LastName,
//			Email:    "",
//			Username: s.MessageSender.UserName,
//			Password: "",
//			UserId:   user.ID,
//			TgId:     s.MessageSenderId,
//			TgChatId: &s.MessageChatId,
//		}
//		err = repo.CreatePatient(patient)
//		if err != nil {
//			_ = s.BotHandler.CreateAndSendMessage(msg.CantCreatePatient)
//			return
//		}
//
//		err = s.BotHandler.CreateAndSendMessage(msg.RegisterComplete)
//		if err != nil {
//			return
//		}
//		_ = s.setNewStory()
//		s.setState(BotStateFillSituation)
//	}
//
//	func (s *StateHandler) processStateFillSituation() {
//		s.Story.Situation = s.MessageText
//		s.setState(BotStateFillMind)
//	}
//
//	func (s *StateHandler) processStateFillMind() {
//		s.Story.Mind = s.MessageText
//		s.setState(BotStateFillEmotion)
//	}
//
//	func (s *StateHandler) processStateFillEmotion() {
//		s.Story.Emotion = s.MessageText
//		s.setState(BotStateFillPower)
//	}
//
//	func (s *StateHandler) processStateFillPower() {
//		power, err := strconv.Atoi(s.MessageText)
//		if err != nil {
//			_ = s.BotHandler.CreateAndSendMessage(msg.DontRecognizePower)
//			return
//		}
//		s.Story.Power = uint8(power)
//
//		err = bot.LoadStory(s.Story)
//		if err != nil {
//			_ = s.BotHandler.CreateAndSendMessage(msg.CantSaveStory)
//			return
//		}
//
//		_ = s.setNewStory()
//		s.setState(BotStateFillSituation, msg.WhatEntryDone)
//	}
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
	s.setState(BotStateFillSituation, message)
}
