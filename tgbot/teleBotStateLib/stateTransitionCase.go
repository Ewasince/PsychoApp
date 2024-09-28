package teleBotStateLib

type StateTransitionType uint

const (
	DontGoState    StateTransitionType = iota
	GoState        StateTransitionType = iota
	GoStateInPlace StateTransitionType = iota
	ReloadState    StateTransitionType = iota
)
