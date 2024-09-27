package teleBotStateLib

type StringifyArray interface {
	ToStringArray(c BotContext) ([]string, error)
}

type HandlerResponse struct {
	NextStateId    BotStateId // which state should go next
	TransitionType StateTransitionType
}

// ContextHandler returns new state id, is new state flag and error
type ContextHandler func(c BotContext) (HandlerResponse, error)
