package messages

var Greeting = "Привет👋! Я бот, который поможет тебе вести свой КПТ дневник!"
var BotError = "У меня произошла ошибка💥. Повтори последне действие или попробуй позже"

var Register = "Для начала отошли мне идентификатор своего терапевта"
var RegisterComplete = "Круто, я тебя зарегестрировал!🎉"
var UserNotFound = "Не нашёл такого терапевта. Проверить корректность вписанного идентификатора!"

var DontRecognizePower = "Я не смог распознать число🙁, убедись что оно находится от 1 до 10"
var CantCreatePatient = "Не получилось создать пациента, попробуй еще раз😔"
var CantSaveStory = "Не получилось сохранить запись, попробуй немного позже😔"

var WhatHappened = "Для заполнения новой истории просто напиши мне что случилось✍️"
var WhatMind = "Что ты подумал в этот момент?"
var WhatMainEmotion = "Какую эмоцию ты почуствовал?"
var WhatEmotion = "Уточни какую конкретно эмоцию ты почувствовал"
var WhatEmotionError = "Пожалуйста, выбери эмоцию из списка"
var WhatPower = "Насколько она была сильна (от 1 до 10)?"
var WhatEntryDone = "Запись заполнена! Буду ждать новых записей😊"

var setSchedule = "Отошли мне час, в котором тебе надо напомнить заполнить дневник (от 0 до 23). "
var SetScheduleSet = setSchedule + " Сейчас у тебя установлено на %d часа(-ов)"
var SetScheduleNotSet = setSchedule + " Сейчас у тебя не установлено напоминание"
var SetScheduleSuccess = "Готово, в следующий раз я оповещу тебя в %s часа(-ов)"
var ResetScheduleSuccess = "Хорошо, я больше не буду слать напоминания"
var DontRecognizeHour = "Не распознал формат часа. Отошли мне час в формате от 0 до 23 или нажми на кнопку"
var ScheduleNotification = "Привет! Напоминаю записать какую-нибудь свою интересную ситуацию😊"

var SetMood = "Укажи своё настроение за сегодня (от -5 до 5)"
var AlreadySetMood = ". За сегодня ты указал настрение %d"
var SetMoodWrong = "Выбери опцию из спика"
var SetMoodSuccess = "Записал настроение"
