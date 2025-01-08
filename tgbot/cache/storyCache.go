package cache

import (
	. "PsychoApp/storage/models"
	"gorm.io/gorm"
)

type StoriesMap map[int64]*Story

var storiesCache = map[int64]*Story{}

func GetStory(patientId int64) *Story {
	story, exists := storiesCache[patientId]
	if !exists {
		return nil
	}
	return story
}

func SetStory(patientId int64, story *Story) *Story {
	storiesCache[patientId] = story
	return storiesCache[patientId]
}

func ResetStory(patientId int64) *Story {
	storiesCache[patientId] = &Story{
		BaseModel: BaseModel{
			Model: gorm.Model{},
		},
	}
	return storiesCache[patientId]
}
