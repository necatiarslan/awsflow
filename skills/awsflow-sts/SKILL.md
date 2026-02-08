---
name: awsflow-sts
description: Get caller identity, assume roles, decode authorization messages, and get temporary credentials using the awsflow VS Code extension STSTool.
---

# awsflow-sts

Use the **STSTool** language tool in VS Code to manage AWS STS (Security Token Service) operations — identity verification, role assumption, temporary credentials, and authorization debugging.

## When to Use
- User wants to verify their AWS identity (who am I?)
- User wants to assume an IAM role
- User wants to get temporary security credentials
- User wants to decode an encoded authorization failure message
- User wants to get a federation token
- User wants to look up account info for an access key
- User needs SAML or web identity token-based role assumption

## Tool Reference

**Tool name:** `STSTool`

### Input Schema

```json
{
  "command": "<CommandName>",
  "params": { ... }
}
```

### Commands (10 total)

| Command | Description |
|---------|-------------|
| AssumeRole | Assume an IAM role and get temporary credentials |
| AssumeRoleWithSAML | Assume a role using a SAML assertion |
| AssumeRoleWithWebIdentity | Assume a role using a web identity (OIDC) token |
| DecodeAuthorizationMessage | Decode an encoded authorization failure message |
| GetAccessKeyInfo | Get the account ID for an access key |
| GetCallerIdentity | Get the identity of the calling credentials (account, ARN, user ID) |
| GetDelegatedAccessToken | Get a delegated access token |
| GetFederationToken | Get temporary credentials for a federated user |
| GetSessionToken | Get temporary session credentials (with optional MFA) |
| GetWebIdentityToken | Get a web identity token for a role |

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| RoleArn | string | IAM role ARN (Required by: AssumeRole, AssumeRoleWithSAML, AssumeRoleWithWebIdentity, GetDelegatedAccessToken, GetWebIdentityToken) |
| RoleSessionName | string | Session name for role assumption (Required by: AssumeRole, AssumeRoleWithWebIdentity, GetWebIdentityToken) |
| DurationSeconds | number | Token lifetime in seconds (Used by: AssumeRole, GetDelegatedAccessToken, GetFederationToken, GetSessionToken, GetWebIdentityToken) |
| ExternalId | string | External ID for cross-account role assumption (Used by: AssumeRole) |
| PolicyArns | array | Managed policy ARNs for session policies (Used by: AssumeRole, AssumeRoleWithWebIdentity, AssumeRoleWithSAML) |
| Policy | string | IAM policy JSON string for temporary credentials (Used by: AssumeRole, GetFederationToken) |
| TransitiveTagKeys | array | Session tag keys to set as transitive (Used by: AssumeRole) |
| SourceIdentity | string | Source identity for role chaining (Used by: AssumeRole) |
| Tags | array | Session tags as `[{Key, Value}]` (Used by: AssumeRole, GetFederationToken) |
| SAMLAssertion | string | Base64-encoded SAML authentication response (Required by: AssumeRoleWithSAML) |
| PrincipalArn | string | ARN of SAML provider (Required by: AssumeRoleWithSAML) |
| WebIdentityToken | string | Web identity (OIDC) token (Required by: AssumeRoleWithWebIdentity, GetWebIdentityToken) |
| ProviderId | string | Identity provider ID (Used by: AssumeRoleWithWebIdentity, GetWebIdentityToken) |
| EncodedMessage | string | Encoded authorization failure message (Required by: DecodeAuthorizationMessage) |
| AccessKeyId | string | AWS access key ID (Required by: GetAccessKeyInfo) |
| DelegationTokenLifetimeSeconds | number | Delegated token lifetime in seconds (Used by: GetDelegatedAccessToken) |
| Name | string | Session or federation token name (Required by: GetFederationToken) |
| SerialNumber | string | MFA device serial number (Used by: GetSessionToken) |
| TokenCode | string | MFA token code (Used by: GetSessionToken) |

## Usage Examples

### Check current identity
```json
{ "command": "GetCallerIdentity", "params": {} }
```

### Assume a role
```json
{ "command": "AssumeRole", "params": { "RoleArn": "arn:aws:iam::123456789012:role/MyRole", "RoleSessionName": "my-session", "DurationSeconds": 3600 } }
```

### Assume a role with external ID (cross-account)
```json
{ "command": "AssumeRole", "params": { "RoleArn": "arn:aws:iam::987654321098:role/CrossAccountRole", "RoleSessionName": "cross-account-session", "ExternalId": "my-external-id" } }
```

### Decode an authorization failure message
```json
{ "command": "DecodeAuthorizationMessage", "params": { "EncodedMessage": "<encoded-message-string>" } }
```

### Get account ID for an access key
```json
{ "command": "GetAccessKeyInfo", "params": { "AccessKeyId": "AKIAIOSFODNN7EXAMPLE" } }
```

### Get session token with MFA
```json
{ "command": "GetSessionToken", "params": { "DurationSeconds": 3600, "SerialNumber": "arn:aws:iam::123456789012:mfa/user", "TokenCode": "123456" } }
```

### Get federation token
```json
{ "command": "GetFederationToken", "params": { "Name": "federated-user", "DurationSeconds": 3600, "Policy": "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":\"s3:*\",\"Resource\":\"*\"}]}" } }
```

### Assume role with web identity
```json
{ "command": "AssumeRoleWithWebIdentity", "params": { "RoleArn": "arn:aws:iam::123456789012:role/WebIdentityRole", "RoleSessionName": "web-session", "WebIdentityToken": "<oidc-token>" } }
```

## Related Services

STS is foundational to AWS security and is used alongside:

| Relationship | Tool |
|-------------|------|
| Manages IAM roles/policies | `IAMTool` |
| Session management | `SessionTool` (in awsflow-general) |
| Test AWS connectivity | `TestAwsConnectionTool` (in awsflow-general) |
| All AWS services require valid credentials | All awsflow tools |

### Tips
- Start with `GetCallerIdentity` to verify which account and identity you're operating as.
- Use `DecodeAuthorizationMessage` when you get "Encoded authorization failure" errors — it reveals the denied action, resource, and conditions.
- `AssumeRole` with `ExternalId` is required for cross-account access when the trust policy mandates it.
- `GetSessionToken` with MFA is useful when your account requires MFA for sensitive operations.
- Temporary credentials from STS calls are valid for the specified `DurationSeconds` (default varies by command).
