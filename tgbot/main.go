package main

import (
	. "EnvironmentModule"
	. "StorageModule/models"
	"StorageModule/repo"
	"fmt"
	"gorm.io/gorm"
	"log"
	"strconv"

	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

type BotInteract string

func (i BotInteract) isEqual(str string) bool {
	return string(i) == str
}
func (i BotInteract) toString() string {
	return string(i)
}

var StartCommandButton BotInteract = "start"
var NewEntryButton BotInteract = "Новая запись"

var messageGreating = "Привет! Я бот, который поможет тебе вести свой КПТ дневник!"
var messageRegister = "Для начала отошли мне идентификатор своего терапевта"
var messageRegisterComplete = "Круто, я тебя зарегестрировал! МОжешь начать мной пользоваться"
var messageUserNotFound = "Не нашёл такого терапевта. Проверить корректность вписанного идентификатора!"
var messageDontRecognizeNumber = "Я не смог распознать число🙁, убедись что оно находится от 1 до 10"
var messageCantCreatePatient = "Не получилось создать пациента, попробуй еще раз😔"

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

		messageSender := update.Message.From
		messageSenderId := messageSender.ID
		messageSenderUserName := messageSender.UserName

		messageChatId := update.Message.Chat.ID

		log.Printf(
			"[%s, %d] %s",
			messageSenderUserName,
			messageSenderId,
			messageText,
		)

		sendMessage := func(msg tg.Chattable) error {
			if _, sendMessageErr := botAPI.Send(msg); sendMessageErr != nil {
				log.Panic(sendMessageErr)
				return sendMessageErr
			}
			return nil
		}

		createMessage := func(text string) tg.MessageConfig {
			return tg.NewMessage(messageChatId, text)
		}

		patient, patientErr := repo.GetPatientByTg(messageSenderId)

		if StartCommandButton.isEqual(messageCommand) {

			msg := createMessage(messageGreating)
			msg.ReplyMarkup = numericKeyboard
			if err = sendMessage(msg); err != nil {
				continue
			}

			if patientErr != nil {
				sendMessage(createMessage(messageRegister))
				continue
			}

		}

		if patientErr != nil {
			var user *User
			user, err = repo.GetUserByUsername(messageText)

			if err != nil {
				sendMessage(createMessage(messageUserNotFound))
				continue
			}

			patient = &Patient{
				BaseModel: BaseModel{
					Model: gorm.Model{},
				},
				Name:     messageSender.FirstName,
				LastName: messageSender.LastName,
				Email:    "",
				Username: messageSender.UserName,
				Password: "",
				UserId:   user.ID,
				TgId:     messageSenderId,
			}
			err = repo.CreatePatient(patient)
			if err != nil {
				_ = sendMessage(createMessage(messageCantCreatePatient))
				continue
			}
			_ = sendMessage(createMessage(messageRegisterComplete))
			continue
		}

		fillingStory, _ := stories[messageSenderId]
		fmt.Printf("fillingStory received=%s\n", fillingStory)
		var botState BotState
		var responseMessage string = ""

		if NewEntryButton.isEqual(messageText) {
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
				power, err := strconv.Atoi(messageText)
				if err != nil {
					sendMessage(createMessage(messageDontRecognizeNumber))
					continue
				}
				fillingStory.Power = uint8(power)
			default:
			}
		}
		botState = checkBotState(*fillingStory)
		fmt.Printf("fillingStory result=%s\n", fillingStory)

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

		err = sendMessage(createMessage(responseMessage))
	}
}

func loadStory(story *Story) {
	*story = Story{}
}
