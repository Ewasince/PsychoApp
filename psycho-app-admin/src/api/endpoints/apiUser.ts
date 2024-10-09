import {credentialsRequest} from "../requestCredential";
import {IMe} from "./apiAuth";

export const GET_ME_URL = "api/get_me";


export type IMeResponse = {
    user: IMe
}


export const getMe = async () => {
    return await credentialsRequest.get<IMeResponse>(
        GET_ME_URL,
    )
}