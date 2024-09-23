import {credentialsRequest} from "../requestCredential";
import {GET_ME_URL, IMeResponse} from "./apiAuth";


export const getMe = async () => {
    return await credentialsRequest.get<IMeResponse>(
        GET_ME_URL,
    )
}