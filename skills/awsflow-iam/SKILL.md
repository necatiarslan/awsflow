---
name: awsflow-iam
description: Manage and inspect AWS IAM roles, policies, users, groups, access keys, MFA devices, simulate permissions, generate credential reports, and get account summary using awsflow.
---

# Awsflow IAM

Manage and inspect IAM roles, policies, users, groups, simulate permissions, and audit credentials.

## When to Use This Skill

Use this skill when the user:

- Asks about IAM roles, policies, or permissions
- Wants to inspect what a role or user can access
- Needs to simulate permissions with `SimulatePrincipalPolicy`
- Wants to audit users, access keys, MFA devices
- Asks about credential reports or account settings
- Needs to check attached or inline policies
- Wants to create, update, or delete IAM roles, users, groups, or policies
- Needs to attach or detach policies and manage tags

## Tool: IAMTool

Execute AWS IAM commands including permission simulation and lifecycle management. ALWAYS provide params object.

### Commands

#### ListRoles
List IAM roles.
```json
{ "command": "ListRoles", "params": { "MaxItems": 100 } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| PathPrefix | string | No | Path prefix filter |
| Marker | string | No | Pagination marker |
| MaxItems | number | No | Maximum items to return |

#### GetRole
Get details of an IAM role.
```json
{ "command": "GetRole", "params": { "RoleName": "my-role" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| RoleName | string | Yes | Target IAM role name |

#### GetRolePolicy
Get an inline policy attached to a role.
```json
{ "command": "GetRolePolicy", "params": { "RoleName": "my-role", "PolicyName": "my-inline-policy" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| RoleName | string | Yes | Role name |
| PolicyName | string | Yes | Inline policy name |

#### ListRolePolicies
List inline policy names for a role.
```json
{ "command": "ListRolePolicies", "params": { "RoleName": "my-role" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| RoleName | string | Yes | Role name |
| Marker | string | No | Pagination marker |
| MaxItems | number | No | Maximum items |

#### ListAttachedRolePolicies
List managed policies attached to a role.
```json
{ "command": "ListAttachedRolePolicies", "params": { "RoleName": "my-role" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| RoleName | string | Yes | Role name |
| PathPrefix | string | No | Path prefix filter |
| Marker | string | No | Pagination marker |
| MaxItems | number | No | Maximum items |

#### ListRoleTags
List tags attached to a role.
```json
{ "command": "ListRoleTags", "params": { "RoleName": "my-role" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| RoleName | string | Yes | Role name |

#### ListPolicies
List IAM policies.
```json
{ "command": "ListPolicies", "params": { "Scope": "Local", "OnlyAttached": true } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Scope | string | No | `All`, `AWS`, or `Local` |
| OnlyAttached | boolean | No | Only list attached policies |
| PolicyUsageFilter | string | No | `PermissionsPolicy` or `PermissionsBoundary` |
| PathPrefix | string | No | Path prefix filter |
| Marker | string | No | Pagination marker |
| MaxItems | number | No | Maximum items |

#### GetPolicy
Get details of a managed policy.
```json
{ "command": "GetPolicy", "params": { "PolicyArn": "arn:aws:iam::123456789012:policy/my-policy" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| PolicyArn | string | Yes | IAM policy ARN |

#### GetPolicyVersion
Get a specific version of a policy document.
```json
{ "command": "GetPolicyVersion", "params": { "PolicyArn": "arn:aws:iam::123456789012:policy/my-policy", "VersionId": "v1" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| PolicyArn | string | Yes | IAM policy ARN |
| VersionId | string | Yes | Policy version ID (e.g., `v1`, `v2`) |

#### ListPolicyVersions
List all versions of a managed policy.
```json
{ "command": "ListPolicyVersions", "params": { "PolicyArn": "arn:aws:iam::123456789012:policy/my-policy" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| PolicyArn | string | Yes | IAM policy ARN |
| Marker | string | No | Pagination marker |
| MaxItems | number | No | Maximum items |

#### ListUsers
List IAM users.
```json
{ "command": "ListUsers", "params": {} }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| PathPrefix | string | No | Path prefix filter |
| Marker | string | No | Pagination marker |
| MaxItems | number | No | Maximum items |

#### GetUser
Get details of an IAM user.
```json
{ "command": "GetUser", "params": { "UserName": "john" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| UserName | string | No | IAM user name (omit for current user) |

#### ListAccessKeys
List access keys for a user.
```json
{ "command": "ListAccessKeys", "params": { "UserName": "john" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| UserName | string | No | IAM user name |

#### ListMFADevices
List MFA devices for a user.
```json
{ "command": "ListMFADevices", "params": { "UserName": "john" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| UserName | string | No | IAM user name |

#### ListGroups
List IAM groups.
```json
{ "command": "ListGroups", "params": {} }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| GroupName | string | No | Group name |

#### GetAccountSummary
Get IAM account summary (resource counts and limits).
```json
{ "command": "GetAccountSummary", "params": {} }
```
**Parameters:** None required.

### Lifecycle Commands

#### CreateRole
Create a new IAM role.
```json
{ "command": "CreateRole", "params": { "RoleName": "MyRole", "AssumeRolePolicyDocument": "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"lambda.amazonaws.com\"},\"Action\":\"sts:AssumeRole\"}]}" } }
```

#### CreateUser
Create a new IAM user.
```json
{ "command": "CreateUser", "params": { "UserName": "alice" } }
```

#### AttachRolePolicy
Attach a managed policy to a role.
```json
{ "command": "AttachRolePolicy", "params": { "RoleName": "MyRole", "PolicyArn": "arn:aws:iam::aws:policy/ReadOnlyAccess" } }
```

#### PutRolePolicy
Add or update an inline policy on a role.
```json
{ "command": "PutRolePolicy", "params": { "RoleName": "MyRole", "PolicyName": "InlinePolicy", "PolicyDocument": "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"s3:ListBucket\"],\"Resource\":[\"*\"]}]}" } }
```

#### DeleteRole
Delete an IAM role.
```json
{ "command": "DeleteRole", "params": { "RoleName": "MyRole" } }
```

#### TagRole
Tag a role.
```json
{ "command": "TagRole", "params": { "RoleName": "MyRole", "Tags": [{ "Key": "env", "Value": "prod" }] } }
```

#### UntagRole
Remove tags from a role.
```json
{ "command": "UntagRole", "params": { "RoleName": "MyRole", "TagKeys": ["env"] } }
```

#### UpdateAssumeRolePolicy
Update a role trust policy.
```json
{ "command": "UpdateAssumeRolePolicy", "params": { "RoleName": "MyRole", "PolicyDocument": "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"ecs.amazonaws.com\"},\"Action\":\"sts:AssumeRole\"}]}" } }
```

#### GetAccountPasswordPolicy
Get the account password policy.
```json
{ "command": "GetAccountPasswordPolicy", "params": {} }
```
**Parameters:** None required.

#### GenerateCredentialReport
Generate a credential report (async — poll with GetCredentialReport).
```json
{ "command": "GenerateCredentialReport", "params": {} }
```
**Parameters:** None required.

#### GetCredentialReport
Get the most recently generated credential report.
```json
{ "command": "GetCredentialReport", "params": {} }
```
**Parameters:** None required.

#### GetServiceLastAccessedDetails
Get last accessed details for services by an IAM entity.
```json
{ "command": "GetServiceLastAccessedDetails", "params": { "JobId": "12345678-1234-1234-1234-123456789012" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| JobId | string | Yes | Job ID from `GenerateServiceLastAccessedDetails` |

#### SimulatePrincipalPolicy
Simulate IAM policy evaluation — test what a role/user can access.
```json
{
  "command": "SimulatePrincipalPolicy",
  "params": {
    "PolicySourceArn": "arn:aws:iam::123456789012:role/MyRole",
    "ActionNames": ["s3:GetObject", "s3:PutObject"],
    "ResourceArns": ["arn:aws:s3:::my-bucket/*"]
  }
}
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| PolicySourceArn | string | Yes | ARN of IAM entity (user, group, role) to simulate |
| ActionNames | array of strings | Yes | API action names to simulate (e.g., `s3:GetObject`) |
| ResourceArns | array of strings | No | Resource ARNs to simulate against |
| ResourcePolicy | string | No | Resource-based policy JSON string |
| ResourceOwner | string | No | AWS account ID owning the resource |
| CallerArn | string | No | ARN of the user making the request |
| ContextEntries | array of objects | No | Context keys and values for policy evaluation |
| ResourceHandlingOption | string | No | How to handle resource-based policies |

---

## Related Services

- **IAM → All Services**: IAM roles and policies control access to every AWS service. Key services using IAM roles:
  - **Lambda**: Execution roles (check `GetFunctionConfiguration` → `Role`)
  - **EC2**: Instance profiles
  - **Glue**: Job execution roles
  - **Step Functions**: State machine execution roles
  - **ECS**: Task execution roles and task roles
- **IAM → STS**: Use `STSTool` `GetCallerIdentity` to verify current identity, `AssumeRole` to switch roles
- **IAM → CloudTrail → CloudWatch**: IAM API calls logged in CloudTrail. Use `CloudWatchLogTool` to search CloudTrail log groups
- **IAM → CloudFormation**: IAM resources managed by CloudFormation stacks
