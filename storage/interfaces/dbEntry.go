package interfaces

type DbEntity[T any] interface {
	Init() T
}
