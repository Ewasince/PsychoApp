package repo

import (
	. "StorageModule/models"
	"gorm.io/gorm"
	"time"
)

type SeverityMark uint8

const (
	NoAttention       SeverityMark = iota
	LowAttention      SeverityMark = iota
	ProbablyAttention SeverityMark = iota
	Attention         SeverityMark = iota
)

type MarksByCount map[uint8]SeverityMark
type CountByPower map[uint8]MarksByCount

var severities = CountByPower{
	1: MarksByCount{1: NoAttention, 2: NoAttention, 3: NoAttention, 4: NoAttention},
	2: MarksByCount{1: NoAttention, 2: NoAttention, 3: LowAttention, 4: LowAttention},
	3: MarksByCount{1: NoAttention, 2: LowAttention, 3: ProbablyAttention, 4: ProbablyAttention},
	4: MarksByCount{1: NoAttention, 2: ProbablyAttention, 3: Attention, 4: Attention},
	5: MarksByCount{1: LowAttention, 2: Attention, 3: Attention, 4: Attention},
	6: MarksByCount{1: ProbablyAttention, 2: Attention, 3: Attention, 4: Attention},
	7: MarksByCount{1: Attention, 2: Attention, 3: Attention, 4: Attention},
}

const maxPower = 7
const maxCount = 4

func GetStories(patientId uint, dateStart, dateFinish time.Time) (*[]Story, error) {
	var stories = make([]Story, 0)
	err := DB.
		Where("patient_id = ?", patientId).
		Where("date >= ?", dateStart).
		Where("date < ?", dateFinish).
		Order("date desc").
		Find(&stories).
		Error

	return &stories, err
}

func GetStoryMinDate(patientId uint) (time.Time, error) {
	var story Story

	err := DB.
		Where("patient_id = ?", patientId).
		Order("date asc").
		First(&story).
		Error

	return story.Date, err
}

func CreateStory(story *Story, db *gorm.DB) error {
	return db.Create(story).Error
}
func SetMark(story *Story, db *gorm.DB) error {
	finishDate := story.Date // TODO: тк время истории округляется до минут, может быть неочевидное поведение
	startDate := finishDate.Add(-7 * 24 * time.Hour)
	weekStories, err := GetStories(story.PatientId, startDate, finishDate)
	if err != nil {
		panic(err)
	}

	var weekStoriesCurrentEmotionPowers []uint8
	for _, s := range *weekStories {
		if s.Emotion == story.Emotion {
			weekStoriesCurrentEmotionPowers = append(weekStoriesCurrentEmotionPowers, s.Power)
		}
	}
	weekStoriesCurrentEmotionPowers = append(weekStoriesCurrentEmotionPowers, story.Power)

	emotionsPowers := make(map[uint8]int)
	for _, num := range weekStoriesCurrentEmotionPowers {
		emotionsPowers[num] = emotionsPowers[num] + 1
	}

	power := story.Power
	count := emotionsPowers[power]

	if power > maxPower {
		power = 7
	}
	countByPower := severities[power]
	if count > maxCount {
		count = 4
	}
	mark := countByPower[uint8(count)]

	story.Mark = uint8(mark)

	return db.Save(story).Error
}
