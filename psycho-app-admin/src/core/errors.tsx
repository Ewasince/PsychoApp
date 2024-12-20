import { NavigateFunction } from "react-router-dom";
import { getAccessToken } from "./storage/tokens";
import { toast } from "react-toastify";
import { isUserEntered } from "../api/auth/common";
import { HttpStatusCode } from "axios";

let LOCATION_WHEN_NOT_VALID_TOKEN = "/login";

export function handleError(error: any, navigate?: NavigateFunction) {
  function logErrorToConsole() {
    console.log(
      "Error: data: ",
      error.response.data,
      "status: ",
      error.response.status,
      "headers: ",
      error.response.headers,
    );
  }

  if (error.response) {
    if (!navigate) {
      logErrorToConsole();
      errorToast(error);
      return;
    }
    if (error.response.status === HttpStatusCode.Unauthorized) {
      if (!isUserEntered()) {
        goToAuthUser(navigate);
      }
      if (!getAccessToken()) {
        goToAuthUser(navigate);
      }
      return;
    }
    if (error.response.status !== HttpStatusCode.Forbidden) {
      logErrorToConsole();
      errorToast(error);
      return;
    }
  } else if (error.request) {
    errorToast(error);
    console.log(error.request);
  } else {
    errorToast(error);
    console.log("Error", error.message);
  }
}

export function goToAuthUser(navigate: NavigateFunction) {
  console.log("goToAuthUser");
  navigate(LOCATION_WHEN_NOT_VALID_TOKEN);
}

export function errorToast(error: any) {
  toast.error("Невозможно выполнить запрос: " + error.message);
}
