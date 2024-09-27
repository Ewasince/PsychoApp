package teleBotStateLib

import (
	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"log"
)

const (
	MaxCallCount = 10
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
	var handlerResponse HandlerResponse
	var isCommandProcess bool

	if c.incCallCount() > MaxCallCount {
		return ToManyCalls
	}

	currentStateId := m.StateManger.GetState(c.GetMessage().From.ID)
	currentState, exists := m.BotStates[currentStateId]
	if !exists {
		return StateNotFound
	}

	handlerResponse, isCommandProcess, err = m.processCommand(c)
	if err != nil {
		return err
	}
	if !isCommandProcess {
		handlerResponse, err = m.defineNewState(c, currentState)
	}
	if err != nil {
		return err
	}

	if handlerResponse.IsNewState {
		newState, exists := m.BotStates[handlerResponse.NextStateId]
		if !exists {
			return StateNotFound
		}
		err = m.transactToNewState(c, newState, currentState)
		if err != nil {
			return err
		}
	}
	if handlerResponse.IsInPlaceState {
		err = m.StateManger.SetState(c.GetMessage().From.ID, handlerResponse.NextStateId)
		if err != nil {
			return err
		}
		return m.ProcessMessage(c)
	}

	return nil
}

// defineNewState returns new bot state id, new state availability flag and error
func (m *BotStatesManager) defineNewState(c BotContext, currentState BotState) (HandlerResponse, error) {
	var handlerResponse HandlerResponse
	var buttonPressed bool
	var err error

	if currentState.Keyboard != nil {
		handlerResponse, buttonPressed, err = currentState.Keyboard.ProcessMessage(c)
		if err != nil {
			return HandlerResponse{}, err
		}
		if buttonPressed {
			return handlerResponse, nil
		}
	}

	handlerResponse, err = currentState.Handler(c)
	if err != nil {
		return HandlerResponse{}, err
	}
	return handlerResponse, nil
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
func (m *BotStatesManager) processCommand(c BotContext) (HandlerResponse, bool, error) {
	message := c.GetMessage()
	botCommand, exists := m.BotCommands[message.Command()]
	if !exists {
		return HandlerResponse{}, false, nil
	}
	handlerResponse, err := botCommand.CommandHandler(c)
	return handlerResponse, true, err
}
