package teleBotStateLib

type StringifyArray interface {
	ToStringArray(c *BotContext) ([]string, error)
}

type ContextHandler func(c *BotContext) (BotStateId, bool, error)
