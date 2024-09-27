package teleBotStateLib

type StringifyArray interface {
	ToStringArray(c BotContext) ([]string, error)
}

// ContextHandler returns new state id, is new state flag and error
type ContextHandler func(c BotContext) (BotStateId, bool, error)
