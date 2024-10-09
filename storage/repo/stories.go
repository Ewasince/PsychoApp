package repo

import (
	. "StorageModule/models"
	"gorm.io/gorm"
	"time"
)


type MarksByCount map[uint8]SeverityMark
type CountByPower map[uint8]MarksByCount

var severities = CountByPower{
	1: MarksByCount{1: Attention0, 2: Attention0, 3: Attention0, 4: Attention0},
	2: MarksByCount{1: Attention0, 2: Attention0, 3: Attention1, 4: Attention1},
	3: MarksByCount{1: Attention0, 2: Attention1, 3: Attention2, 4: Attention2},
	4: MarksByCount{1: Attention1, 2: Attention1, 3: Attention2, 4: Attention3},
	5: MarksByCount{1: Attention1, 2: Attention2, 3: Attention3, 4: Attention3},
	6: MarksByCount{1: Attention2, 2: Attention3, 3: Attention3, 4: Attention3},
	7: MarksByCount{1: Attention3, 2: Attention3, 3: Attention3, 4: Attention3},
}

const maxPower = 7
const maxCount = 4

func GetStories(patientId uint, dateStart, dateFinish time.Time) ([]*Story, error) {
	var stories []*Story
	err := DB.
		Where("patient_id = ?", patientId).
		Where("date >= ?", dateStart).
		Where("date < ?", dateFinish).
		Order("date desc").
		Find(&stories).
		Error

	return stories, err
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
	lastWeekStories, err := GetStories(story.PatientId, startDate, finishDate)
	if err != nil {
		panic(err)
	}

	var lastWeekPowers []uint8 // силы данной эмоции за прошедшую неделю
	for _, s := range *lastWeekStories {
		if s.Emotion == story.Emotion {
			lastWeekPowers = append(lastWeekPowers, s.Power)
		}
	}
	lastWeekPowers = append(lastWeekPowers, story.Power)

	emotionsPowers := make(map[uint8]int)
	for _, num := range lastWeekPowers {
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
