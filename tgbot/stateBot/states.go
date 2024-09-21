package stateBot

type BotState int

const (
	BotStateInitial       BotState = iota
	BotStateRegister      BotState = iota
	BotStateFillSituation BotState = iota
	BotStateFillMind      BotState = iota
	BotStateFillEmotion   BotState = iota
	BotStateFillPower     BotState = iota
	BotStateFillSchedule  BotState = iota
)
