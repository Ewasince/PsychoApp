package interacts

type BotInteract string

func (i BotInteract) IsEqual(str string) bool {
	return string(i) == str
}
func (i BotInteract) ToString() string {
	return string(i)
}
