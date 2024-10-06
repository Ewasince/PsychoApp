package models

type Invite struct {
	BaseModel
	Email string
}

//// ToMap turn User struct into map
//func (u *User) ToMap() gin.H {
//	return map[string]any{
//		"id":       u.ID,
//		"username": u.Username,
//	}
//}
