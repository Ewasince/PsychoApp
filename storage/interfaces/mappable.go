package interfaces

import "github.com/gin-gonic/gin"

type Mappable interface {
	ToMap() gin.H
}
