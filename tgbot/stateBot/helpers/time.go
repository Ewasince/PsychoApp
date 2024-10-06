package helpers

import "time"

func GetScheduleTime(scheduleHour int) time.Time {
	now := time.Now().Truncate(time.Hour)
	scheduleInHours := scheduleHour - now.Hour()
	if scheduleInHours < 0 {
		scheduleInHours = scheduleInHours + 24
	}

	return now.Add(time.Hour * time.Duration(scheduleInHours))
}

func GetDate() time.Time {
	return time.Now().Truncate(time.Minute)
}
