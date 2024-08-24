package structures

// User demo
type UserId int
type User struct {
	Id        UserId
	Username  string
	Password  string `private:"true"`
	FirstName string
	LastName  string
}

// Map turn User struct into map
func (u *User) Map() map[string]any {
	return map[string]interface{}{
		"id":       u.Id,
		"username": u.Username,
		//"FirstName": u.FirstName,
		//"LastName": u.LastName,
	}
}
