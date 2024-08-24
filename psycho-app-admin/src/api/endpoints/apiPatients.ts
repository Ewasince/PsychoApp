// auth
import {makeGet, makePost} from "../apiCore";


export const PATIENTS_URL = "api/patient"

export type IPatient = {
    id:        number
    firstName: string
    lastName:  string
}


export const getPatients = makeGet<IPatient[]>(
    PATIENTS_URL,
)

export const getPatient = makeGet<IPatient>(
    PATIENTS_URL,
)

export type IStory = {
    id:           number
    date:         string
    situation:    string
    mind:         string
    emotion:      string
    emotionPower: number
}

export const getPatientStories = makeGet<IStory[]>(
    PATIENTS_URL,
)
