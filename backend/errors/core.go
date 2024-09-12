package errors

import (
	"errors"
	"github.com/gin-gonic/gin"
)

var NotFoundErrorCode uint16 = 404
var UnauthorizedErrorCode uint16 = 404

var defaultErrorCode uint16 = NotFoundErrorCode

type webError struct {
	error
	textCode     string
	responseCode uint16
}

func (w *webError) ToMap() gin.H {
	return gin.H{
		//"responseCode": strconv.Itoa(int(w.responseCode)),
		"code":    w.textCode,
		"message": w.Error(),
	}
}

func (w *webError) JSONError(c *gin.Context) {
	c.JSON(int(w.responseCode), w.ToMap())
}

func newError(message string, textCode string, responseCode *uint16) IWebError {
	err := errors.New(message)

	if responseCode == nil {
		responseCode = &defaultErrorCode
	}
	return &webError{
		error:        err,
		textCode:     textCode,
		responseCode: *responseCode,
	}
}

type IWebError interface {
	error
	JSONError(c *gin.Context)
}
