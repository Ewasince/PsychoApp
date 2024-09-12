package models

type Patient struct {
	BaseModel
	Name     string
	Email    string
	Password string
	UserId   uint
}
