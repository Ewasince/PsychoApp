package messages

const Greeting = "Привет👋! Я бот, который поможет тебе вести свой КПТ дневник!"
const BotError = "У меня произошла ошибка💥. Повтори последне действие или попробуй позже"

const Register = "Для начала отошли мне идентификатор своего терапевта"
const RegisterComplete = "Круто, я тебя зарегестрировал!🎉\n\nПредлагаю ознакомиться с описанием КПТ терапии"
const UserNotFound = "Не нашёл такого терапевта. Проверить корректность вписанного идентификатора!"

const DontRecognizePower = "Я не смог распознать число🙁, убедись что оно находится от 1 до 10"
const CantCreatePatient = "Не получилось создать пациента, попробуй еще раз😔"
const CantSaveStory = "Не получилось сохранить запись, попробуй немного позже😔"

const WhatHappened = "Для заполнения новой истории просто напиши мне что случилось✍️"
const WhatMind = "Что ты подумал в этот момент?"
const WhatMainEmotion = "Какую эмоцию ты почуствовал?"
const WhatEmotion = "Уточни какую конкретно эмоцию ты почувствовал(-а)"
const WhatEmotionError = "Пожалуйста, выбери эмоцию из списка"
const WhatPower = "Насколько она была сильна (от 1 до 10)?"
const WhatEntryDone = "Запись заполнена! Буду ждать новых записей"

const setSchedule = "Отошли мне час, в котором тебе надо напомнить заполнить дневник (от 0 до 23). "
const SetScheduleSet = setSchedule + " Сейчас у тебя установлено на %d часа(-ов)"
const SetScheduleNotSet = setSchedule + " Сейчас у тебя не установлено напоминание"
const SetScheduleSuccess = "Готово, в следующий раз я оповещу тебя в %s часа(-ов)"
const ResetScheduleSuccess = "Хорошо, я больше не буду слать напоминания"
const DontRecognizeHour = "Не распознал формат часа. Отошли мне час в формате от 0 до 23 или нажми на кнопку"
const ScheduleNotification = "Привет! Напоминаю записать, что важного для тебя произошло сегодня"

const SetMood = "Укажи своё настроение за сегодня (от -5 до 5)"
const AlreadySetMood = ". За сегодня ты указал(-а) настрение %d"
const SetMoodWrong = "Выбери опцию из спика"
const SetMoodSuccess = "Записал настроение"

const ShowStoriesPresentStories = "Вот твои последние несколько записей"
const ShowStoriesPresentStoriesEdit = "Для редактирования записи пришли мне её номер"
const ShowStoriesNoStories = "У тебя пока нет записей"
