# Yandex.Cloud Lockbox
Action for GitHub, which helps work with Lockbox, secret vault.

[Lockbox](https://cloud.yandex.ru/services/lockbox) - A service for creating and storing secrets in the Yandex.Cloud infrastructure.
Create secrets in the management console or using the API.

This Action can export your secrets value to env-params. 

For example, we have this secret data: 
```json
{
    "entries": [
        {
            "key": "test/text",
            "textValue": "Hello GitHub!"
        }
    ],
    "versionId": "e6qd9u2611d857ol3dhv"
}
```

The result of Action, if we want to get the value of `test/text` key secret, will be the environment value `$LOCKBOX_TEST_TEXT`, which contains the value is `Hello GitHub!`
## Example of usage

```yaml
- name: Create IAM token
  uses: bigtows/yc-token@latest
  id: generation-iam-token
  with:
    service-account-token: ${{ secrets.SERVICE_ACCOUNT_TOKEN }}
    type-token: iam
- name: Testing text
  uses: bigtows/yc-lockbox@latest
  with:
    iam-token: ${{ steps.generation-iam-token.outputs.iam-token }}
    secret-id:  ${{ secrets.LOCKBOX_SECRET_ID }}
    secret-key:  test/text
- name: Echo text
  run: |
    echo "$LOCKBOX_TEST_TEXT"
```