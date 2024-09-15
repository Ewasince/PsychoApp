package bot

import (
	"StorageModule/models"
)

type StoriesMap map[int64]*models.Story

var StoriesCache = make(StoriesMap)
