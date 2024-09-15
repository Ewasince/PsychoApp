package errors

var RouteNotFound = newError("route not found", RouteNotFoundCode, 0)

var UserNotFound = newError("user not found", UserNotFoundCode, 0)
var UserNotAuthorized = newError("user not found", UserNotAuthenticatedCode, 404)
var AccessForbidden = newError("you have not access to this content", UserForbidden, 403)

var PatientNotFound = newError("patient not found", PatientNotFoundCode, 0)

var WrongDateFormat = newError("wrong date format", DefaultCode, 0)
