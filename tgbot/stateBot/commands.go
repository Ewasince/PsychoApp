package stateBot

import (
	"PsychoBot/bot"
	. "PsychoBot/interacts"
	msg "PsychoBot/messages"
	. "StorageModule/models"
	"StorageModule/repo"
	"gorm.io/gorm"
)

func (s *StateHandler) ProcessCommand() bool {
	command := BotInteract(s.MessageCommand)

	commandMap := map[BotInteract]func(){
		StartCommandButton: func() {
			_ = s.setNewStory()
			s.setState(BotStateFillSituation)
		},
		ScheduleCommandButton: func() {
			s.setState(BotStateFillSchedule)
		},
		ResetScheduleCommandButton: s.processResetSchedule,
	}

	commandFunc, exists := commandMap[command]
	if !exists {
		return false
	}

	if !bot.IsPatientRegistered(s.MessageSenderId) {
		s.setState(BotStateRegister)
		return true
	}
	commandFunc()
	return true
}

func (s *StateHandler) processResetSchedule() {
	patient, err := repo.GetPatientByTg(s.MessageSenderId)
	if err != nil {
		s.botError(err)
		return
	}
	err = bot.SaveSchedule(&Patient{
		BaseModel:    BaseModel{Model: gorm.Model{ID: patient.ID}},
		NextSchedule: nil,
	})
	s.setState(BotStateFillSituation, msg.ResetScheduleSuccess)
}
