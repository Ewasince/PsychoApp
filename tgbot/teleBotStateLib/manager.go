package teleBotStateLib

import (
	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"log"
)

type BotStatesManager struct {
	BotStates   map[BotStateId]BotState
	BotCommands map[string]BotCommand
	StateManger StateCacheManager
}

func NewBotStatesManager(
	botStates []BotState,
	botCommands []BotCommand,
	stateManager StateCacheManager,
) *BotStatesManager {
	botStatesMap := make(map[BotStateId]BotState, len(botStates))
	for _, botState := range botStates {
		botStatesMap[botState.BotStateId] = botState
	}

	botCommandsMap := make(map[string]BotCommand, len(botCommands))
	for _, botCommand := range botCommands {
		botCommandsMap[botCommand.CommandMessage] = botCommand
	}

	return &BotStatesManager{
		BotStates:   botStatesMap,
		BotCommands: botCommandsMap,
		StateManger: stateManager,
	}
}

func (m *BotStatesManager) ProcessMessage(c BotContext) error {
	var err error
	var isNewState bool
	var isCommandProcess bool
	var newStateId BotStateId

	currentStateId := m.StateManger.GetState(c.GetMessage().From.ID)
	currentState, exists := m.BotStates[currentStateId]
	if !exists {
		return StateNotFound
	}

	newStateId, isNewState, isCommandProcess, err = m.processCommand(c)
	if err != nil {
		return err
	}
	if !isCommandProcess {
		newStateId, isNewState, err = m.defineNewState(c, currentState)
	}

	if isNewState {
		newState, exists := m.BotStates[newStateId]
		if !exists {
			return StateNotFound
		}
		err = m.transactToNewState(c, newState, currentState)
		if err != nil {
			return err
		}
	}

	return nil
}

// defineNewState returns new bot state id, new state availability flag and error
func (m *BotStatesManager) defineNewState(c BotContext, currentState BotState) (BotStateId, bool, error) {
	var newStateId BotStateId
	var isNewState = false
	var buttonPressed = false
	var err error

	if currentState.Keyboard != nil {
		newStateId, isNewState, buttonPressed, err = currentState.Keyboard.ProcessMessage(c)
		if err != nil {
			return newStateId, isNewState, err
		}
		if buttonPressed {
			return newStateId, isNewState, nil
		}
	}

	newStateId, isNewState, err = currentState.Handler(c)
	if err != nil {
		return newStateId, isNewState, err
	}
	return newStateId, isNewState, nil
}

func (m *BotStatesManager) transactToNewState(
	c BotContext,
	currentState BotState,
	newState BotState,
) error {
	var messages []string
	var err error

	if currentState.MessageExit != nil {
		exitMessages, err := (*currentState.MessageExit).ToStringArray(c)
		if err != nil {
			return err
		}
		messages = append(messages, exitMessages...)
	}

	if newState.MessageEnter != nil {
		enterMessages, err := (*newState.MessageEnter).ToStringArray(c)
		if err != nil {
			return err
		}
		messages = append(messages, enterMessages...)
	}

	if len(messages) > 0 {
		var messagesForSend = c.CreateMessages(messages...)
		if newState.Keyboard != nil {
			lastMessageForSend := messagesForSend[len(messagesForSend)-1]
			lastMessageForSend.ReplyMarkup = newState.Keyboard.GetKeyBoard()
		}

		var chattableMessages []tg.Chattable
		for _, msg := range messagesForSend {
			chattableMessages = append(chattableMessages, msg)
		}
		err = c.SendMessages(chattableMessages...)
		if err != nil {
			return err
		}
	} else if newState.Keyboard != nil {
		log.Panicf("in state %s defined keyboard without enter message!", newState.BotStateId)
	}

	err = m.StateManger.SetState(c.GetMessage().From.ID, newState.BotStateId)
	if err != nil {
		return err
	}

	return nil
}

// processCommand returns new state, new state flag, command processed flag and err
func (m *BotStatesManager) processCommand(c BotContext) (BotStateId, bool, bool, error) {
	message := c.GetMessage()
	botCommand, exists := m.BotCommands[message.Command()]
	if !exists {
		return 0, false, false, nil
	}
	newState, isNewState, err := botCommand.CommandHandler(c)
	return newState, isNewState, true, err
}
