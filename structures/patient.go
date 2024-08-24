package structures

import "github.com/gin-gonic/gin"

type PatientId int
type Patient struct {
	Id        PatientId
	FirstName string
	LastName  string
	//Username  string
	//Password  string `private:"true"`
}

// ToMap turn Patient struct into map
func (p *Patient) ToMap() gin.H {
	return map[string]interface{}{
		"id":        p.Id,
		"firstName": p.FirstName,
		"lastName":  p.LastName,
	}
}
