package cache

import (
	. "StorageModule/models"
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

func ResetStory(patientId int64) *Story {
	storiesCache[patientId] = &Story{
		BaseModel: BaseModel{
			Model: gorm.Model{},
		},
	}
	return storiesCache[patientId]
}
