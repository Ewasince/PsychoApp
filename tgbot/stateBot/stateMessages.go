package stateBot

import (
	msg "PsychoBot/messages"
	"StorageModule/repo"
	"fmt"
)

type StringProvider interface {
	GetMessages() (*[]string, error)
}

// Реализация для []string
type StringArray []string

func (s StringArray) GetMessages() (*[]string, error) {
	return (*[]string)(&s), nil
}

// Реализация для func() []string
type StringFunc func() (*[]string, error)

func (sf StringFunc) GetMessages() (*[]string, error) {
	return sf()
}

func (s *StateHandler) getMessageBeforeState(state BotState) (*[]string, error) {
	stateMessages := map[BotState]StringProvider{
		BotStateRegister:      StringArray{msg.Greeting, msg.Register},
		BotStateFillSituation: StringArray{msg.WhatHappened},
		BotStateFillMind:      StringArray{msg.WhatMind},
		BotStateFillEmotion:   StringArray{msg.WhatEmotion},
		BotStateFillPower:     StringArray{msg.WhatPower},
		BotStateFillSchedule:  StringFunc(s.messageBeforeFillSchedule),
	}
	messagesProvider, exists := stateMessages[state]
	if !exists {
		return nil, nil
	}
	return messagesProvider.GetMessages()
}

func (s *StateHandler) messageBeforeFillSchedule() (*[]string, error) {
	patient, err := repo.GetPatientByTg(s.MessageSenderId)
	if err != nil {
		return nil, err
	}

	var message string
	if patient.NextSchedule != nil {
		message = fmt.Sprintf(msg.SetScheduleSet, patient.NextSchedule.Hour())
	} else {
		message = msg.SetScheduleNotSet
	}

	return &[]string{message}, nil
}
