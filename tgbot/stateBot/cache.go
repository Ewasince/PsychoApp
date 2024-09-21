package stateBot

type StatesMap map[int64]BotState

var statesCache = make(StatesMap)

func getCacheState(patientTgId int64) BotState {
	state, exists := statesCache[patientTgId]
	if !exists {
		state = BotStateInitial
	}
	return state
}
func setCacheState(patientTgId int64, state BotState) {
	statesCache[patientTgId] = state
}
