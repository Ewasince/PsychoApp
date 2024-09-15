package main

import . "StorageModule/models"

type BotState int

const (
	botStateFillSituation BotState = iota
	botStateFillMind      BotState = iota
	botStateFillEmotion   BotState = iota
	botStateFillPower     BotState = iota
	botStateFilled        BotState = iota
)

func checkBotState(story Story) BotState {
	if story.Situation == "" {
		return botStateFillSituation
	}
	if story.Mind == "" {
		return botStateFillMind
	}
	if story.Emotion == "" {
		return botStateFillEmotion
	}
	if story.Power == 0 {
		return botStateFillPower
	}
	return botStateFilled
}
