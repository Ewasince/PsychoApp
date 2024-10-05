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

export type IMood = {
    id: number
    date: number
    value: number
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

export type IDataRangeMinDate = {
    minDate: number
}
export type IStoriesResponse = {
    stories: IStory[]
}
export type IDataRangeParams = {
    dateStart: number
    dateFinish: number
}

export const getPatientStoriesMinDate = async (patientId: string) => {
    return await credentialsRequest.get<IDataRangeMinDate>(
        generateUrl(PATIENTS_URL, patientId, "story"),
    )
}

export const getPatientStories = async (patientId: string, params?: IDataRangeParams) => {
    return await credentialsRequest.get<IStoriesResponse>(
        generateUrl(PATIENTS_URL, patientId, "story"),
        params ? {params: params} : {},
    )
}

export type IMoodsResponse = {
    moods: IMood[]
}

export const getPatientMoodsMinDate = async (patientId: string) => {
    return await credentialsRequest.get<IDataRangeMinDate>(
        generateUrl(PATIENTS_URL, patientId, "mood"),
    )
}

export const getPatientMoods = async (patientId: string, params?: IDataRangeParams) => {
    return await credentialsRequest.get<IMoodsResponse>(
        generateUrl(PATIENTS_URL, patientId, "mood"),
        params ? {params: params} : {},
    )
}
