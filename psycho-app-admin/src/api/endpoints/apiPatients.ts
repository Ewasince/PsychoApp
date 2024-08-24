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
