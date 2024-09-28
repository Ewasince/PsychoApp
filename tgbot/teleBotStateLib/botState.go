package teleBotStateLib

type BotStateId int

type BotMessages []string

func (b BotMessages) ToStringArray(c BotContext) ([]string, error) { return b, nil }

type BotMessageHandler func(c BotContext) ([]string, error)

func (b BotMessageHandler) ToStringArray(c BotContext) ([]string, error) { return b(c) }

type BotState struct {
	BotStateId   BotStateId
	MessageEnter StringifyArray
	MessageExit  StringifyArray
	Keyboard     *BotKeyboard
	Handler      ContextHandler
}

func NewBotState(
	BotStateId BotStateId,
	MessageEnter StringifyArray,
	MessageExit StringifyArray,
	Keyboard *BotKeyboard,
	Handler ContextHandler,
) BotState {
	if Keyboard != nil && MessageEnter == nil {
		panic(KeyboardAndEnterMessage)
	}
	return BotState{
		BotStateId,
		MessageEnter,
		MessageExit,
		Keyboard,
		Handler,
	}
}
