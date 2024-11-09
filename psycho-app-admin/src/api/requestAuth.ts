import axios from "axios";
import { API_HOST } from "../core/env";
import { getAccessToken } from "../core/storage/tokens";
import { addToHeaderToken } from "./apiCore";

export const credentialsEmptyRequest = axios.create({
  baseURL: API_HOST,
  withCredentials: true,
});
export const refreshRequest = axios.create({
  baseURL: API_HOST,
  withCredentials: true,
});

refreshRequest.interceptors.request.use((config) => {
  addToHeaderToken(config, getAccessToken);
  return config;
});
