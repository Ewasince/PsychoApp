package states

import (
	"PsychoApp/storage/models"
	"PsychoApp/storage/repo"
	msg "PsychoApp/tgbot/messages"
	"fmt"
	"strconv"

	//msg "PsychoApp/tgbot/messages"
	"PsychoApp/tgbot/stateBot/context"
	. "github.com/Ewasince/go-telegram-state-bot/enums"
	. "github.com/Ewasince/go-telegram-state-bot/interfaces"
	"github.com/Ewasince/go-telegram-state-bot/message_types"
	. "github.com/Ewasince/go-telegram-state-bot/message_types"
	. "github.com/Ewasince/go-telegram-state-bot/states"

	. "github.com/Ewasince/go-telegram-state-bot/keyboard"
)

const StoryCount = 3

var showStoriesState = NewBotState(
	"Show Stories State",
	BotMessageHandler(enterMessageHandlerShowStoriesState),
	nil,
	&BotKeyboard{Keyboard: []ButtonsRow{
		{
			BotButton{
				ButtonTitle:   "Назад",
				ButtonHandler: keyboardBackButtonHandler,
			},
		},
	}},
	messageHandlerShowStoriesState,
)

func enterMessageHandlerShowStoriesState(c BotContext) (Messagables, error) {
	ctx := *c.(*context.MyBotContext)

	stories, err := repo.GetStoriesByCount(ctx.Patient.ID, StoryCount)

	if err != nil {
		panic(err)
	}

	var messages = message_types.BotMessages{}
	if len(messages) > 0 {
		messages = append(messages, message_types.TextMessage(msg.ShowStoriesPresentStories))

		for index, story := range stories {
			var message = message_types.TextMessage(storyToMessage(index, story))
			messages = append(messages, message)
		}

		messages = append(messages, message_types.TextMessage(msg.ShowStoriesPresentStoriesEdit))
	} else {
		messages = append(messages, message_types.TextMessage(msg.ShowStoriesNoStories))
	}

	return messages, nil
}
func storyToMessage(index int, story *models.Story) string {
	var text = ""

	text = fmt.Sprintf("%s%v\n", text, index)
	text = fmt.Sprintf("%sдата:     %s\n", text, story.Date)
	text = fmt.Sprintf("%sситуация: %s\n", text, story.Situation)
	text = fmt.Sprintf("%sмысль:    %s\n", text, story.Mind)
	text = fmt.Sprintf("%sэмоция:   %s\n", text, story.Emotion)
	text = fmt.Sprintf("%sсила:     %v\n", text, story.Power)

	return text
}

func messageHandlerShowStoriesState(c BotContext) HandlerResponse {
	ctx := c.(*context.MyBotContext)

	storyNumText := ctx.GetMessageText()
	storyNum, err := strconv.Atoi(storyNumText)

	if err != nil {
		panic(err)
	}
	if storyNum > StoryCount {
		panic("Too big value for edit story")
	}

	stories, err := repo.GetStoriesByCount(ctx.Patient.ID, storyNum)

	story := stories[storyNum]

	ctx.SetStory(story)

	story.Situation = ctx.MessageText
	return HandlerResponse{
		NextState:      &FillStoryMindState,
		TransitionType: GoState,
	}
}
