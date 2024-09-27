package teleBotStateLib

type StringifyArray interface {
	ToStringArray(c BotContext) ([]string, error)
}

type HandlerResponse struct {
	NextStateId    BotStateId // which state should go next
	IsNewState     bool       // if set program process new state
	IsInPlaceState bool       // set state pass control to it without wait next message
}

// ContextHandler returns new state id, is new state flag and error
type ContextHandler func(c BotContext) (HandlerResponse, error)
