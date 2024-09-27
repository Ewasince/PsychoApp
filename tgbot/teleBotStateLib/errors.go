package teleBotStateLib

import "errors"

var StateNotFound = errors.New("state %s not found")
var KeyboardAndEnterMessage = errors.New("state with keyboard must go with enter message")
