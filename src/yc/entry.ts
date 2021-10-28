/**
 * Entry response from payload Lockbox
 * @link https://cloud.yandex.ru/docs/lockbox/api-ref/Payload/get
 */
export default interface Entry {
  /**
   * Non-confidential key of the entry.
   */
  key: string
  /**
   * Text value.
   */
  textValue?: string
  /**
   * Binary value.
   */
  binaryValue?: string
}
