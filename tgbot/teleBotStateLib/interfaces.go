package teleBotStateLib

type StringifyArray interface {
	ToStringArray(c BotContext) ([]string, error)
}

type HandlerResponse struct {
	NextStateId BotStateId // which state should go next
	IsNewState  bool       // if set program process new state
	NoUserWait  bool       // process state in this message bounds
}

// ContextHandler returns new state id, is new state flag and error
type ContextHandler func(c BotContext) (HandlerResponse, error)
