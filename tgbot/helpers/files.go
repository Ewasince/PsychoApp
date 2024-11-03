package helpers

import (
	. "EnvironmentModule"
)

func GetImageFilename(path string) string {
	return Env.IMAGES_PATH + "/" + path
}
