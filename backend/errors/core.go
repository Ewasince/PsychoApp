package errors

import "C"
import (
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
)

var NotFoundErrorCode uint16 = 404
var UnauthorizedErrorCode uint16 = 404

var defaultErrorCode = NotFoundErrorCode

type WebError struct {
	error
	textCode     string
	responseCode uint16
}

func (w *WebError) ToMap() gin.H {
	return gin.H{
		//"responseCode": strconv.Itoa(int(w.responseCode)),
		"code":    w.textCode,
		"message": w.Error(),
	}
}

func newError(message string, textCode string, responseCode *uint16) error {
	err := errors.New(message)

	if responseCode == nil {
		responseCode = &defaultErrorCode
	}
	return &WebError{
		error:        err,
		textCode:     textCode,
		responseCode: *responseCode,
	}
}

func JSONError(c *gin.Context, err error) {
	switch err.(type) {
	default:
		c.JSON(int(defaultErrorCode), gin.H{
			"code":    DEFAULT_CODE,
			"message": fmt.Sprintf("%v", err),
		})

		//fmt.Printf("unexpected type %T", v)
	case WebError:
		webError := err.(WebError)
		c.JSON(int(webError.responseCode), webError.ToMap())
	}
}
