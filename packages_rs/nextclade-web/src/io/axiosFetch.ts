import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { isNil } from 'lodash'
import { ErrorInternal } from 'src/helpers/ErrorInternal'
import { sanitizeError } from 'src/helpers/sanitizeError'

export class HttpRequestError extends Error {
  public readonly request: AxiosRequestConfig
  public readonly response?: AxiosResponse

  constructor(error_: AxiosError) {
    super(error_.message)
    this.request = error_.config
    this.response = error_.response
  }
}

export async function axiosFetch<TData = unknown>(
  url: string | undefined,
  options?: AxiosRequestConfig,
): Promise<TData> {
  if (isNil(url)) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new ErrorInternal(`Attempted to fetch from an invalid URL: '${url}'`)
  }

  let res
  try {
    res = await axios.get(url, options)
  } catch (error) {
    throw axios.isAxiosError(error) ? new HttpRequestError(error) : sanitizeError(error)
  }

  if (!res?.data) {
    throw new Error(`Unable to fetch: request to URL "${url}" resulted in no data`)
  }

  return res.data as TData
}

export async function axiosFetchMaybe(url?: string): Promise<string | undefined> {
  if (!url) {
    return undefined
  }
  return axiosFetch(url)
}

export async function axiosFetchOrUndefined<TData = unknown>(
  url: string | undefined,
  options?: AxiosRequestConfig,
): Promise<TData | undefined> {
  try {
    return await axiosFetch<TData>(url, options)
  } catch {
    return undefined
  }
}

/**
 * This version skips any transforms (such as JSON parsing) and returns plain string
 */
export async function axiosFetchRaw(url: string | undefined, options?: AxiosRequestConfig): Promise<string> {
  return axiosFetch(url, { ...options, transformResponse: [] })
}

export async function axiosFetchRawMaybe(url?: string): Promise<string | undefined> {
  if (!url) {
    return undefined
  }
  return axiosFetchRaw(url)
}

export async function axiosHead<TData = unknown>(
  url: string | undefined,
  options?: AxiosRequestConfig,
): Promise<TData> {
  if (isNil(url)) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new ErrorInternal(`Attempted to fetch from an invalid URL: '${url}'`)
  }

  let res
  try {
    res = await axios.head(url, options)
  } catch (error) {
    throw axios.isAxiosError(error) ? new HttpRequestError(error) : sanitizeError(error)
  }

  return res.data as TData
}
