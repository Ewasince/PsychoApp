package cache

import (
	. "StorageModule/models"
)

type StoriesMap map[int64]*Story

var storiesCache = map[int64]*Story{}

func GetStory(patientId int64) *Story {
	story, exists := storiesCache[patientId]
	if !exists {
		return ResetStory(patientId)
	}
	return story
}

func ResetStory(patientId int64) *Story {
	storiesCache[patientId] = &Story{}
	return storiesCache[patientId]
}
