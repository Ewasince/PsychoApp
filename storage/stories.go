package storage

import (
	"PsychoAppAdmin/errors"
	. "PsychoAppAdmin/structures"
	"time"
)

var storiesByPatients = map[PatientId][]Story{
	20: {
		{
			Id:           31,
			Date:         time.Now().AddDate(0, 0, -2).Add(-5 * time.Hour),
			Situation:    "Had a stressful day at work",
			Mind:         "Worried about meeting deadlines",
			Emotion:      "Anxiety",
			EmotionPower: 7,
		},
		{
			Id:           32,
			Date:         time.Now().AddDate(0, 0, -1).Add(-2 * time.Hour),
			Situation:    "Spent time with family",
			Mind:         "Felt connected and happy",
			Emotion:      "Joy",
			EmotionPower: 8,
		},
	},
	21: {
		{
			Id:           33,
			Date:         time.Now().AddDate(0, 0, -2).Add(-5 * time.Hour),
			Situation:    "Missed an important appointment",
			Mind:         "Regretful and frustrated",
			Emotion:      "Frustration",
			EmotionPower: 6,
		},
		{
			Id:           34,
			Date:         time.Now().AddDate(0, 0, -1).Add(-2 * time.Hour),
			Situation:    "Received a compliment at work",
			Mind:         "Proud and motivated",
			Emotion:      "Pride",
			EmotionPower: 9,
		},
	},
	22: {
		{
			Id:           35,
			Date:         time.Now().AddDate(0, 0, -2).Add(-6 * time.Hour),
			Situation:    "Had a difficult conversation with a friend",
			Mind:         "Confused and uncertain",
			Emotion:      "Sadness",
			EmotionPower: 5,
		},
	},
}

func GetStories(patientId PatientId, dateStart, dateFinish time.Time) ([]Story, errors.IWebError) {
	// STUB: !!!
	stories, found := storiesByPatients[patientId]

	if !found {
		return nil, errors.PatientNotFound
	}

	return stories, nil
}

func GetStoryMinDate(patientId PatientId) (time.Time, errors.IWebError) {
	// STUB: !!!

	return time.Now().AddDate(0, 0, -5), nil
}
