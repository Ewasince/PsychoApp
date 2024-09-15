package stateBot

type StatesMap map[int64]BotState

var StatesCache = make(StatesMap)

func (s *StatesMap) GetState(patientTgId int64) BotState {
	state, exists := StatesCache[patientTgId]
	if !exists {
		state = BotStateInitial
	}
	return state
}
func (s *StatesMap) ResetState(patientTgId int64) {
	StatesCache[patientTgId] = BotStateInitial
}
