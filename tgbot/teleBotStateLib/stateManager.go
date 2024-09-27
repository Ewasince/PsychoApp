package teleBotStateLib

type StateCacheManager interface {
	SetState(int64, BotStateId) error
	GetState(int64) BotStateId
}

type BaseStateCacheManager struct {
	StatesCache map[int64]BotStateId
}

func NewBaseStateCacheManager() StateCacheManager {
	return &BaseStateCacheManager{
		StatesCache: map[int64]BotStateId{},
	}
}

func (s *BaseStateCacheManager) SetState(key int64, botStateId BotStateId) error {
	s.StatesCache[key] = botStateId
	return nil
}

func (s *BaseStateCacheManager) GetState(key int64) BotStateId {
	state, exists := s.StatesCache[key]
	if !exists {
		return BotStateId(0)
	}
	return state
}
