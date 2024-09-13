package errors

var RouteNotFound = newError("route not found", RouteNotFoundCode, nil)

var UserNotFound = newError("user not found", UserNotFoundCode, nil)
var UserNotAuthorized = newError("user not found", UserNotAuthenticatedCode, &UnauthorizedErrorCode)

var PatientNotFound = newError("patient not found", PatientNotFoundCode, nil)

var WrongDateFormat = newError("wrong date format", DefaultCode, nil)
