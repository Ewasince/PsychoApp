package errors

var DEFAULT_CODE = "ERROR"

// var UserNotAuthorized = errors.New("incorrect Username or Password")
var UserNotFound = newError("user not found", "USER_NOT_FOUND", nil)
var PatientNotFound = newError("patient not found", "PATIENT_NOT_FOUND", nil)
var WrongDateFormat = newError("wrong date format", DEFAULT_CODE, nil)
