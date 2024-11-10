package helpers

import (
	. "PsychoApp/environment"
)

func GetImageFilename(path string) string {
	return Env.IMAGES_PATH + "/" + path
}
