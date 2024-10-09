package repo

import (
	. "StorageModule/models"
)

type PowerStat struct {
	RealEntries     uint
	AbstractEntries uint
	LastMark        SeverityMark
}

const maxCount = 4

func (p *PowerStat) getCount(val uint) uint8 {
	if val > maxCount {
		return maxCount
	}
	return uint8(val)
}
func (p *PowerStat) getRealCount() uint8 {
	return p.getCount(p.RealEntries)
}
func (p *PowerStat) getAbstractCount() uint8 {
	return p.getCount(p.AbstractEntries)
}
