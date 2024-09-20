package messages

var Greating = "Привет! Я бот, который поможет тебе вести свой КПТ дневник!"
var BotError = "У меня произошла ошибка. Повтори последне действие или попробуй позже"

var Register = "Для начала отошли мне идентификатор своего терапевта"
var RegisterComplete = "Круто, я тебя зарегестрировал! Можешь начать мной пользоваться, для этого просто начни мне рассказывать про ситуацию"
var UserNotFound = "Не нашёл такого терапевта. Проверить корректность вписанного идентификатора!"

var DontRecognizePower = "Я не смог распознать число🙁, убедись что оно находится от 1 до 10"
var CantCreatePatient = "Не получилось создать пациента, попробуй еще раз😔"
var CantSaveStory = "Не получилось сохранить запись, попробуй немного позже😔"

var WhatHappened = "Расскажи что случилось?"
var WhatMind = "Что ты подумал в этот момент?"
var WhatEmotion = "Какую эмоцию ты почуствовал?"
var WhatPower = "Насколько она была сильна (от 1 до 10)?"
var WhatEntryDone = "Запись заполнена! Буду ждать новых записей😊 Для заполнения новой истории можешь просто написать мне ситуацию или нажать кнопку"

var setSchedule = "Отошли мне час, в котором тебе надо напомнить заполнить дневник (от 0 до 23). "
var SetScheduleSet = setSchedule + " Сейчас у тебя установлено на %d часа(-ов)"
var SetScheduleNotSet = setSchedule + " Сейчас у тебя не установлено напоминание"
var SetScheduleSuccess = "Готово, в следующий раз я оповещу тебя в %s часа(-ов)"
var ResetScheduleSuccess = "Хорошо, я больше не буду слать напоминания"
var DontRecognizeHour = "Не распознал формат часа. Отошли мне час в формате от 0 до 23"
