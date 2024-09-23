// auth
import {generateUrl} from "../apiCore";
import {credentialsRequest} from "../requestCredential";


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

export const getPatients = async () => {
    return await credentialsRequest.get<IPatient[]>(
        PATIENTS_URL,
    )
}

export const getPatient = async (patientId: string) => {
    return await credentialsRequest.get<IPatient>(
        generateUrl(PATIENTS_URL, patientId),
    )
}

export type IStoriesMinDate = {
    minDate: number
}
export type IStoriesResponse = {
    stories: IStory[]
}
export type IStoriesParams = {
    dateStart: number
    dateFinish: number
}

export const getPatientStoriesMinDate = async (patientId: string) => {
    return await credentialsRequest.get<IStoriesMinDate>(
        generateUrl(PATIENTS_URL, patientId, "story"),
    )
}

export const getPatientStories = async (patientId: string, params?: IStoriesParams) => {
    return await credentialsRequest.get<IStoriesResponse>(
        generateUrl(PATIENTS_URL, patientId, "story"),
        params ? {params: params} : {},
    )
}
