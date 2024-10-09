package repo

import (
	. "StorageModule/models"
	"gorm.io/gorm"
	"time"
)

const maxPower = 7

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
	finishDate := story.Date
	startDate := finishDate.Add(-7 * 24 * time.Hour)
	lastWeekStories, err := GetStories(story.PatientId, startDate, finishDate)
	if err != nil {
		panic(err)
	}
	lastWeekStories = append([]*Story{story}, lastWeekStories...)

	lastWeekPowersStats := make(map[uint8]*PowerStat)
	for _, weekStory := range lastWeekStories {
		if weekStory.Emotion != story.Emotion {
			continue
		}

		isReal := true
		for i := weekStory.Power; i >= uint8(1); i-- {
			powerStat, exists := lastWeekPowersStats[i]
			if !exists {
				powerStat = &PowerStat{}
				lastWeekPowersStats[i] = powerStat
			}
			if isReal {
				powerStat.RealEntries++
				isReal = false
			}
			powerStat.AbstractEntries++
			powerStat.LastMark = weekStory.Mark
		}

	}

	currentPower := story.Power
	if currentPower > maxPower {
		currentPower = 7
	}
	var maxRealMark = Attention0
	var maxAbstractMark = Attention0
	var lastMarkForAbstract = Attention0

	for power := currentPower; power >= 1; power-- {

		countByPower := severities[power]

		emotionStat := lastWeekPowersStats[power]

		realCount := emotionStat.getRealCount()
		realMark := countByPower[realCount]
		if realMark > maxRealMark {
			maxRealMark = realMark
		}

		abstractCount := emotionStat.getAbstractCount()
		abstractMark := countByPower[abstractCount]
		if abstractMark > maxAbstractMark {
			maxAbstractMark = abstractMark
			lastMarkForAbstract = emotionStat.LastMark
		}
	}

	if maxRealMark > maxAbstractMark {
		story.Mark = maxRealMark
		return db.Save(story).Error
	}
	if maxAbstractMark > lastMarkForAbstract {
		story.Mark = maxAbstractMark
		return db.Save(story).Error
	}

	return nil
}
