import * as core from '@actions/core'
import YandexLockboxRepository from './yc/yandex-lockbox-repository'
import Entry from './yc/entry'

async function run(): Promise<void> {
  try {
    const iamToken: string = core.getInput('iam-token')
    const secretId: string = core.getInput('secret-id')
    const versionId: any =
      core.getInput('version-id').trim().length === 0
        ? undefined
        : core.getInput('version-id')
    const secretKey: string = core.getInput('secret-key')

    const lockboxRepository: YandexLockboxRepository =
      new YandexLockboxRepository(iamToken, secretId, versionId)
    await lockboxRepository.load()

    const entry: Entry = lockboxRepository.findOne(secretKey)
    core.exportVariable(
      'LOCKBOX_' + secretKey.toUpperCase().replace('/', '_'),
      entry.textValue !== undefined ? entry.textValue : entry.binaryValue
    )
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
