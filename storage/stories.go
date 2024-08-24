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
			Date:         time.Date(2023, 8, 15, 10, 0, 0, 0, time.UTC),
			Situation:    "Had a stressful day at work",
			Mind:         "Worried about meeting deadlines",
			Emotion:      "Anxiety",
			EmotionPower: 7,
		},
		{
			Id:           32,
			Date:         time.Date(2023, 8, 16, 14, 30, 0, 0, time.UTC),
			Situation:    "Spent time with family",
			Mind:         "Felt connected and happy",
			Emotion:      "Joy",
			EmotionPower: 8,
		},
	},
	21: {
		{
			Id:           33,
			Date:         time.Date(2023, 8, 17, 9, 0, 0, 0, time.UTC),
			Situation:    "Missed an important appointment",
			Mind:         "Regretful and frustrated",
			Emotion:      "Frustration",
			EmotionPower: 6,
		},
		{
			Id:           34,
			Date:         time.Date(2023, 8, 18, 18, 15, 0, 0, time.UTC),
			Situation:    "Received a compliment at work",
			Mind:         "Proud and motivated",
			Emotion:      "Pride",
			EmotionPower: 9,
		},
	},
	22: {
		{
			Id:           35,
			Date:         time.Date(2023, 8, 19, 22, 45, 0, 0, time.UTC),
			Situation:    "Had a difficult conversation with a friend",
			Mind:         "Confused and uncertain",
			Emotion:      "Sadness",
			EmotionPower: 5,
		},
	},
}

func GetStories(patientId PatientId) ([]Story, errors.IWebError) {
	// STUB: !!!
	stories, found := storiesByPatients[patientId]

	if !found {
		return nil, errors.PatientNotFound
	}

	return stories, nil
}
