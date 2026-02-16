---
name: awsflow-lambda
description: Manage AWS Lambda functions using awsflow. Create, update, invoke, and delete functions, manage aliases/versions, event source mappings, layers, tags, function URLs, concurrency, and code signing.
---

# Awsflow Lambda

Manage AWS Lambda functions, event source mappings, aliases, versions, and layers.

## When to Use This Skill

Use this skill when the user:

- Asks about Lambda functions or serverless
- Wants to invoke a Lambda function
- Needs to update function code
- Wants to inspect function configuration, concurrency, or URLs
- Asks about event source mappings (SQS, SNS, DynamoDB, Kinesis triggers)
- Needs to manage aliases, versions, or layers
- Wants to tag or untag Lambda resources
- Wants to create, update, or delete Lambda functions
- Needs to manage permissions or function URLs

## Tool: LambdaTool

Execute AWS Lambda commands including lifecycle management and event source mappings. ALWAYS provide params object.

### Commands

#### ListFunctions
List Lambda functions.
```json
{ "command": "ListFunctions", "params": { "MaxItems": 50 } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| FunctionVersion | string | No | Set to `ALL` to include all versions |
| Marker | string | No | Pagination marker from previous response |
| MaxItems | number | No | Maximum number of functions to return |
| MasterRegion | string | No | For Lambda@Edge, the region of the master function |

#### GetFunction
Get function details including code location.
```json
{ "command": "GetFunction", "params": { "FunctionName": "my-function" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| FunctionName | string | Yes | Function name or ARN |
| Qualifier | string | No | Function version or alias |

#### GetFunctionConfiguration
Get function configuration (runtime, handler, memory, timeout, environment, role, etc.).
```json
{ "command": "GetFunctionConfiguration", "params": { "FunctionName": "my-function" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| FunctionName | string | Yes | Function name or ARN |
| Qualifier | string | No | Function version or alias |

#### GetFunctionConcurrency
Get reserved concurrency settings.
```json
{ "command": "GetFunctionConcurrency", "params": { "FunctionName": "my-function" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| FunctionName | string | Yes | Function name or ARN |

#### GetFunctionCodeSigningConfig
Get code signing configuration.
```json
{ "command": "GetFunctionCodeSigningConfig", "params": { "FunctionName": "my-function" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| FunctionName | string | Yes | Function name or ARN |

#### GetFunctionUrlConfig
Get function URL configuration.
```json
{ "command": "GetFunctionUrlConfig", "params": { "FunctionName": "my-function" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| FunctionName | string | Yes | Function name or ARN |

#### GetPolicy
Get the resource-based policy attached to a function.
```json
{ "command": "GetPolicy", "params": { "FunctionName": "my-function" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| FunctionName | string | Yes | Function name or ARN |

#### GetAccountSettings
Get Lambda account-level settings and limits.
```json
{ "command": "GetAccountSettings", "params": {} }
```
**Parameters:** None required.

#### Invoke
Invoke a Lambda function.
```json
{ "command": "Invoke", "params": { "FunctionName": "my-function", "Payload": "{\"key\":\"value\"}", "InvocationType": "RequestResponse", "LogType": "Tail" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| FunctionName | string | Yes | Function name or ARN |
| Payload | string | No | JSON string payload to pass to function |
| InvocationType | string | No | `Event` (async), `RequestResponse` (sync), `DryRun` (validate) |
| LogType | string | No | `None` or `Tail` (include execution log in response) |
| Qualifier | string | No | Function version or alias |
| ClientContext | string | No | Base64-encoded client context data |

#### UpdateFunctionCode
Update a function's deployment package.
```json
{ "command": "UpdateFunctionCode", "params": { "FunctionName": "my-function", "S3Bucket": "code-bucket", "S3Key": "code.zip", "Publish": true } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| FunctionName | string | Yes | Function name or ARN |
| ZipFile | string | No | Base64-encoded zip file containing function code |
| S3Bucket | string | No | S3 bucket containing the function code |
| S3Key | string | No | S3 object key for the function code |
| S3ObjectVersion | string | No | S3 object version |
| ImageUri | string | No | URI of a container image in Amazon ECR |
| Publish | boolean | No | Publish a new version after updating |
| DryRun | boolean | No | Validate without updating |
| RevisionId | string | No | Update only if revision ID matches |
| Architectures | array of strings | No | Instruction set: `x86_64` or `arm64` |

### Lifecycle Commands

#### CreateFunction
Create a new Lambda function.
```json
{ "command": "CreateFunction", "params": { "FunctionName": "my-func", "Runtime": "nodejs18.x", "Role": "arn:aws:iam::123456789012:role/LambdaRole", "Handler": "index.handler", "Code": { "S3Bucket": "code-bucket", "S3Key": "code.zip" } } }
```

#### UpdateFunctionConfiguration
Update function configuration.
```json
{ "command": "UpdateFunctionConfiguration", "params": { "FunctionName": "my-func", "MemorySize": 512, "Timeout": 30 } }
```

#### DeleteFunction
Delete a function.
```json
{ "command": "DeleteFunction", "params": { "FunctionName": "my-func" } }
```

#### CreateEventSourceMapping
Create an event source mapping.
```json
{ "command": "CreateEventSourceMapping", "params": { "FunctionName": "my-func", "EventSourceArn": "arn:aws:sqs:us-east-1:123456789012:queue", "StartingPosition": "LATEST" } }
```

#### AddPermission
Add a resource-based permission.
```json
{ "command": "AddPermission", "params": { "FunctionName": "my-func", "StatementId": "sns-invoke", "Action": "lambda:InvokeFunction", "Principal": "sns.amazonaws.com", "SourceArn": "arn:aws:sns:us-east-1:123456789012:topic" } }
```

#### CreateFunctionUrlConfig
Create a function URL.
```json
{ "command": "CreateFunctionUrlConfig", "params": { "FunctionName": "my-func", "AuthType": "NONE" } }
```

#### PutFunctionConcurrency
Set reserved concurrency.
```json
{ "command": "PutFunctionConcurrency", "params": { "FunctionName": "my-func", "ReservedConcurrentExecutions": 10 } }
```

#### PublishVersion
Publish a new version.
```json
{ "command": "PublishVersion", "params": { "FunctionName": "my-func" } }
```

#### CreateAlias
Create an alias for a version.
```json
{ "command": "CreateAlias", "params": { "FunctionName": "my-func", "Name": "prod", "FunctionVersion": "1" } }
```

#### UpdateAlias
Update an alias.
```json
{ "command": "UpdateAlias", "params": { "FunctionName": "my-func", "Name": "prod", "FunctionVersion": "2" } }
```

#### DeleteAlias
Delete an alias.
```json
{ "command": "DeleteAlias", "params": { "FunctionName": "my-func", "Name": "prod" } }
```

#### PublishLayerVersion
Publish a new layer version.
```json
{ "command": "PublishLayerVersion", "params": { "LayerName": "my-layer", "Content": { "S3Bucket": "code-bucket", "S3Key": "layer.zip" } } }
```

#### ListAliases
List aliases for a function.
```json
{ "command": "ListAliases", "params": { "FunctionName": "my-function" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| FunctionName | string | Yes | Function name or ARN |

#### GetAlias
Get details of a specific alias.
```json
{ "command": "GetAlias", "params": { "FunctionName": "my-function", "Name": "prod" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| FunctionName | string | Yes | Function name or ARN |
| Name | string | Yes | Alias name |

#### ListVersionsByFunction
List published versions of a function.
```json
{ "command": "ListVersionsByFunction", "params": { "FunctionName": "my-function" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| FunctionName | string | Yes | Function name or ARN |

#### ListEventSourceMappings
List event source mappings for a function.
```json
{ "command": "ListEventSourceMappings", "params": { "FunctionName": "my-function" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| FunctionName | string | No | Function name or ARN |
| EventSourceArn | string | No | ARN of event source (SQS, DynamoDB, Kinesis, etc.) |

#### GetEventSourceMapping
Get details of an event source mapping.
```json
{ "command": "GetEventSourceMapping", "params": { "UUID": "12345678-1234-1234-1234-123456789012" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| UUID | string | Yes | Event source mapping UUID |

#### ListLayerVersions
List versions for a Lambda layer.
```json
{ "command": "ListLayerVersions", "params": { "LayerName": "my-layer" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| LayerName | string | Yes | Layer name |
| CompatibleRuntime | string | No | Filter by compatible runtime |
| CompatibleArchitecture | string | No | Filter by compatible architecture |

#### ListFunctionsByCodeSigningConfig
List functions using a code signing configuration.
```json
{ "command": "ListFunctionsByCodeSigningConfig", "params": { "CodeSigningConfigArn": "arn:..." } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| CodeSigningConfigArn | string | Yes | Code signing config ARN |

#### ListTags
List tags for a Lambda resource.
```json
{ "command": "ListTags", "params": { "Resource": "arn:aws:lambda:us-east-1:123456789012:function:my-function" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Resource | string | Yes | Function ARN |

#### TagResource
Add tags to a Lambda resource.
```json
{ "command": "TagResource", "params": { "Resource": "arn:aws:lambda:...", "Tags": { "env": "prod" } } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Resource | string | Yes | Function ARN |
| Tags | object | Yes | Key-value pairs for tags |

#### UntagResource
Remove tags from a Lambda resource.
```json
{ "command": "UntagResource", "params": { "Resource": "arn:aws:lambda:...", "TagKeys": ["env"] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Resource | string | Yes | Function ARN |
| TagKeys | array of strings | Yes | Tag keys to remove |

---

## Related Services

- **Lambda → CloudWatch Logs**: Every Lambda function writes logs to `/aws/lambda/{functionName}`. Use `CloudWatchLogTool` with `DescribeLogGroups` prefix `/aws/lambda/` to find them
- **Lambda → SQS/SNS/DynamoDB/Kinesis**: Use `ListEventSourceMappings` to discover trigger sources. Then use `SQSTool`, `SNSTool`, `DynamoDBTool` to inspect those sources
- **Lambda → API Gateway**: API Gateway integrations invoke Lambda. Use `APIGatewayTool` `GetIntegration` to find Lambda targets
- **Lambda → IAM**: Use `GetFunctionConfiguration` to find the execution role ARN, then `IAMTool` `GetRole` and `ListAttachedRolePolicies` to inspect permissions
- **Lambda → S3**: Functions often read/write S3. Use `S3Tool` to inspect referenced buckets
- **Lambda → Step Functions**: Lambda is commonly used as Step Functions task states
- **Lambda → CloudFormation**: Serverless functions managed by CloudFormation/SAM — use `CloudFormationTool` `DescribeStackResources`
