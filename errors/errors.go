package errors

// var UserNotAuthorized = errors.New("incorrect Username or Password")
var UserNotFound = newError("user not found", "USER_NOT_FOUND", nil)
