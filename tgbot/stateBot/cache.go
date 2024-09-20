package stateBot

type StatesMap map[int64]BotState

var statesCache = make(StatesMap)

func GetState(patientTgId int64) BotState {
	state, exists := statesCache[patientTgId]
	if !exists {
		state = BotStateInitial
	}
	return state
}
func ResetState(patientTgId int64) {
	statesCache[patientTgId] = BotStateInitial
}
func SetState(patientTgId int64, state BotState) {
	statesCache[patientTgId] = state
}
