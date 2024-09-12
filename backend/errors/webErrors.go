package errors

var DEFAULT_CODE = "ERROR"

// var UserNotAuthorized = errors.Init("incorrect Username or Password")
var UserNotFound = newError("user not found", "USER_NOT_FOUND", nil)
var UserNotAuthorized = newError("user not found", "USER_NOT_AUTHENTICATED", &UnauthorizedErrorCode)
var PatientNotFound = newError("patient not found", "PATIENT_NOT_FOUND", nil)
var WrongDateFormat = newError("wrong date format", DEFAULT_CODE, nil)
