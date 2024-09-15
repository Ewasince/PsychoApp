package main

import (
	. "EnvironmentModule"
	. "StorageModule/models"
	"fmt"
	"log"
	"strconv"

	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

type BotInteract string

func (i BotInteract) isSimilarTo(str string) bool {
	return string(i) == str
}
func (i BotInteract) toString() string {
	return string(i)
}

var StartCommandButton BotInteract = "start"
var NewEntryButton BotInteract = "Новая запись"

var botGreating = "Привет! Я бот, который поможет тебе вести свой КПТ дневник!"

var numericKeyboard = tg.NewReplyKeyboard(
	tg.NewKeyboardButtonRow(
		tg.NewKeyboardButton(NewEntryButton.toString()),
	),
)

func main() {
	botAPI, err := tg.NewBotAPI(Env.BOT_TOKEN)
	if err != nil {
		log.Fatal(err)
	}

	u := tg.NewUpdate(0)
	u.Timeout = 60

	updates := botAPI.GetUpdatesChan(u)

	stories := make(map[int64]*Story)

	for update := range updates {
		if update.Message == nil {
			continue
		}

		messageCommand := update.Message.Command()
		messageText := update.Message.Text
		messageSenderId := update.Message.From.ID
		messageSender := update.Message.From.UserName

		messageChatId := update.Message.Chat.ID

		log.Printf(
			"[%s, %d] %s",
			messageSender,
			messageSenderId,
			messageText,
		)

		log.Printf(
			"[%s, %d] command: %s",
			messageSender,
			messageSenderId,
			messageCommand,
		)

		if StartCommandButton.isSimilarTo(messageCommand) {
			msg := tg.NewMessage(messageChatId, botGreating)
			msg.ReplyMarkup = numericKeyboard

			if _, err := botAPI.Send(msg); err != nil {
				log.Panic(err)
			}
			continue
		}

		fillingStory, _ := stories[messageSenderId]
		fmt.Printf("fillingStory received=%s\n", fillingStory)
		var botState BotState
		var responseMessage string = ""

		if NewEntryButton.isSimilarTo(messageText) {
			fillingStory = &Story{}
			stories[messageSenderId] = fillingStory
		} else {
			botState = checkBotState(*fillingStory)
			fmt.Printf("fill!\n")
			switch botState {
			case botStateFillSituation:
				fillingStory.Situation = messageText
			case botStateFillMind:
				fillingStory.Mind = messageText
			case botStateFillEmotion:
				fillingStory.Emotion = messageText
			case botStateFillPower:
				var power int
				power, err = strconv.Atoi(messageText)
				if err != nil {
					responseMessage = "Я не смог распознать число🙁, убедись что оно находится от 1 до 10"
				} else {
					fillingStory.Power = uint8(power)
				}
			default:
			}
		}
		botState = checkBotState(*fillingStory)
		fmt.Printf("fillingStory result=%s\n", fillingStory)

		if responseMessage == "" {
			switch botState {
			case botStateFillSituation:
				responseMessage = "Расскажи что случилось?"
			case botStateFillMind:
				responseMessage = "Что ты подумал в этот момент?"
			case botStateFillEmotion:
				responseMessage = "Какую эмоцию ты почуствовал?"
			case botStateFillPower:
				responseMessage = "Насколько она была сильна (от 1 до 10)?"
			case botStateFilled:
				responseMessage = "Запись заполнена! Буду ждать новых записей😊 " +
					"Для заполнения новой истории можешь просто написать мне ситуацию или нажать кнопку"
				loadStory(fillingStory)
			}
		}

		if _, err := botAPI.Send(
			tg.NewMessage(messageChatId, responseMessage),
		); err != nil {
			log.Panic(err)
		}
	}
}

func loadStory(story *Story) {
	*story = Story{}
}
