import * as core from '@actions/core'
import Entry from './entry'
import axios from 'axios'

const YC_LOCKBOX_API =
  'https://payload.lockbox.api.cloud.yandex.net/lockbox/v1/secrets/%_SECRET_ID_%/payload'

export default class YandexLockboxRepository {
  private readonly yandexLockboxPayloadUrl: string
  private readonly axiosConfiguration: object
  private storage: Entry[]

  constructor(iamToken: string, secretId: string, versionId?: string) {
    this.storage = []
    this.yandexLockboxPayloadUrl = YC_LOCKBOX_API.replace(
      '%_SECRET_ID_%',
      secretId
    )
    this.axiosConfiguration = YandexLockboxRepository.buildAxiosParams(
      iamToken,
      versionId
    )
  }

  /**
   * Build config for Axios
   * @param iamToken authorization bearer token
   * @param versionId optional parameter, version of secret
   * @private
   */
  private static buildAxiosParams(
    iamToken: string,
    versionId?: string
  ): object {
    const axiosConfiguration = {
      params: {},
      timeout: 10 * 1000,
      headers: {
        Authorization: `Bearer ${iamToken}`,
        'Content-Type': 'application/json'
      }
    }

    if (typeof versionId !== 'undefined') {
      core.debug('User specific version id!')
      axiosConfiguration.params = {
        versionId
      }
    }
    return axiosConfiguration
  }

  async load(): Promise<void> {
    const response = await axios.get(
      this.yandexLockboxPayloadUrl,
      this.axiosConfiguration
    )

    if (response.status !== 200) {
      throw new Error(
        `Can't load secrets for Lockbox, status: ${response.status} (${response.statusText})`
      )
    }

    if (
      typeof response.data !== 'object' ||
      response.data.entries === undefined
    ) {
      throw new Error(`Lockbox return invalid data`)
    }
    this.storage = response.data.entries
  }

  findOne(secretKey: string): Entry {
    const result: Entry | undefined = this.storage.find((keyValue: Entry) => {
      return keyValue.key === secretKey
    })

    if (result === undefined) {
      throw new Error(`Can't find secret with key: ${secretKey}`)
    }
    core.setSecret(
      result.textValue !== undefined
        ? result.textValue
        : (result.binaryValue as string)
    )
    return result
  }
}
