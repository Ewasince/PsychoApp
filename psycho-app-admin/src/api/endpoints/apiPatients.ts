// auth
import {makeGet} from "../apiCore";


export const PATIENTS_URL = "api/patient"

export type IPatient = {
    id: number
    firstName: string
    lastName: string
}

export type IStory = {
    id: number
    date: number
    situation: string
    mind: string
    emotion: string
    emotionPower: number
}

export const getPatients = makeGet<IPatient[]>(
    PATIENTS_URL,
)

export const getPatient = makeGet<IPatient>(
    PATIENTS_URL,
)

export type IStoriesResponse = {
    stories: IStory[]
}
export type IStoriesMinDate = {
    minDate: number
}

export const getPatientStoriesMinDate = makeGet<IStoriesMinDate>(
    PATIENTS_URL,
)

export const getPatientStories = makeGet<IStoriesResponse>(
    PATIENTS_URL,
)
