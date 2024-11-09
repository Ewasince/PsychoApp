import { InternalAxiosRequestConfig } from "axios";

export function addToHeaderToken(
  config: InternalAxiosRequestConfig<any>,
  tokenFunc: () => string,
) {
  if (!config.headers) {
    return;
  }
  const token = tokenFunc();
  config.headers.Authorization = "Bearer " + token || "";
}

export function generateUrl(
  baseUrl: string,
  ...urlParams: Array<string>
): string {
  let url = baseUrl;
  if (urlParams.length) {
    urlParams.forEach(function (param) {
      url = url + `/${param}`;
    });
  }
  return url;
}
