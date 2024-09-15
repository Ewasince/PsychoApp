package bot

import (
	"StorageModule/models"
)

type StoriesMap map[int64]*models.Story

var StoriesCache = make(StoriesMap)

//
//func (s *StoriesMap) GetStory(patientTgId int64) (*models.Story, exists) {
//	_, exists := StoriesCache[patientTgId]
//	return exists
//}
//func (s *StoriesMap) IsStoryExists(patientTgId int64) bool {
//	_, exists := StoriesCache[patientTgId]
//	return exists
//}
