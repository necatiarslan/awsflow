---
name: awsflow-general
description: General AWS management in VS Code using awsflow extension. Covers AWS connectivity, session management, profiles, regions, endpoints, file operations, testing connections, safety model, cross-service discovery, and extension capabilities.
---

# Awsflow General

Awsflow is a VS Code extension that provides AI-assisted AWS management capabilities. It allows users to interact with AWS services using natural language prompts directly within VS Code.

## When to Use This Skill

Use this skill when the user:

- Asks how to connect to AWS or configure credentials
- Wants to switch AWS profiles, regions, or endpoints
- Needs to test AWS connectivity
- Asks about awsflow extension capabilities or features
- Wants to perform local file operations (read, write, zip)
- Needs to understand cross-service relationships (e.g., which services produce CloudWatch logs)
- Asks about safety, permissions, or readonly mode
- Wants to manage session settings

## Extension Capabilities

### Natural Language AWS Management
- Ask questions about your AWS resources in plain English
- Execute AWS API calls through chat prompts
- Automatic pagination handling with "Load More" in chat

### UI Features
- **S3 Explorer**: Interactive bucket browser via `OpenS3Explorer` command
- **CloudWatch Log Viewer**: Interactive log viewer via `OpenCloudWatchLogView` command
- **Command History**: Panel showing all API calls with responses
- **Service Access View**: Enable/disable individual tools per workspace
- **Status Bar**: Quick selectors for AWS profile and region

### MCP Support
- Built-in for VS Code / GitHub Copilot (no setup needed)
- Stdio MCP bridge for Google Antigravity, Windsurf, Cursor, and other editors
- Up to 3 concurrent MCP sessions
- Tool availability controlled via `awsflow.mcp.disabledTools` setting

### Safety Model
- **Read-only operations** (list, describe, get): Execute automatically without confirmation
- **Mutating operations** (put, post, upload, delete, create, update, invoke, start, execute): Require user confirmation before execution
- **Readonly mode**: Available via `SetAwsReadonlyMode` to block all write operations

---

## AWS Connectivity & Session Management

### How Credentials Work
Awsflow uses the standard AWS SDK credential provider chain:
1. Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)
2. AWS SSO (Single Sign-On) via `aws sso login`
3. Shared credentials file (`~/.aws/credentials`)
4. Shared config file (`~/.aws/config`)

**Important**: No credentials are ever sent to AI services. All API calls execute locally.

### Quick Setup Steps
1. Install the awsflow extension in VS Code
2. Use `TestAwsConnectionTool` to verify connectivity
3. Use `SessionTool` with `ListProfiles` to see available profiles
4. Use `SessionTool` with `SetSession` to configure profile and region
5. Start using any AWS service tool via chat

---

## Tool: SessionTool

Get or set AWS session values (AwsProfile, AwsEndPoint, AwsRegion), list available profiles, or refresh cached credentials.

### Commands

#### GetSession
Read current session values (profile, region, endpoint).
```json
{ "command": "GetSession", "params": {} }
```
**Parameters:** None required.

#### SetSession
Update session values. Omit any param to leave it unchanged.
```json
{ "command": "SetSession", "params": { "AwsProfile": "my-profile", "AwsRegion": "us-west-2" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| AwsProfile | string | No | AWS profile name to set |
| AwsEndPoint | string | No | Custom AWS/S3-compatible endpoint to set (e.g., LocalStack) |
| AwsRegion | string | No | AWS region to set (e.g., us-east-1, eu-west-1) |

#### ListProfiles
Return profile names detected from AWS config/credentials files.
```json
{ "command": "ListProfiles", "params": {} }
```
**Parameters:** None required.

#### RefreshCredentials
Clear and reload cached credentials. Use after `aws sso login` or credential rotation.
```json
{ "command": "RefreshCredentials", "params": {} }
```
**Parameters:** None required.

---

## Tool: FileOperationsTool

Perform local file operations: read, write, append, get metadata, list directories, create zip archives.

### Commands

#### ReadFile
Read file content with optional encoding.
```json
{ "command": "ReadFile", "params": { "filePath": "/path/to/file.txt" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| filePath | string | Yes | File path to read |
| encoding | string | No | File encoding (default: utf-8) |

#### WriteFile
Create or overwrite a file.
```json
{ "command": "WriteFile", "params": { "filePath": "/path/to/file.txt", "content": "Hello World" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| filePath | string | Yes | File path to write |
| content | string | Yes | Content to write |
| encoding | string | No | File encoding |
| overwrite | boolean | No | Allow overwriting existing files |
| ensureDir | boolean | No | Create parent directories when missing |

#### AppendFile
Append content to an existing file.
```json
{ "command": "AppendFile", "params": { "filePath": "/path/to/file.txt", "content": "new line" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| filePath | string | Yes | File path to append to |
| content | string | Yes | Content to append |
| encoding | string | No | File encoding |
| ensureDir | boolean | No | Create parent directories when missing |

#### ReadFileStream
Get file metadata (size, type, modified date) without reading content.
```json
{ "command": "ReadFileStream", "params": { "filePath": "/path/to/file.txt" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| filePath | string | Yes | File path |

#### ReadFileAsBase64
Read file content as Base64 encoded string.
```json
{ "command": "ReadFileAsBase64", "params": { "filePath": "/path/to/image.png" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| filePath | string | Yes | File path to read |

#### GetFileInfo
Get file statistics (size, creation time, modification time, etc.).
```json
{ "command": "GetFileInfo", "params": { "filePath": "/path/to/file.txt" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| filePath | string | Yes | File path |

#### ListFiles
List contents of a directory.
```json
{ "command": "ListFiles", "params": { "dirPath": "/path/to/dir", "recursive": true } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| dirPath | string | Yes | Directory path to list |
| recursive | boolean | No | Recursively list files in subdirectories |

#### ZipTextFile
Create a zip archive of a file or directory.
```json
{ "command": "ZipTextFile", "params": { "filePath": "/path/to/dir" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| filePath | string | Yes | File or directory path to zip |
| outputPath | string | No | Custom output path for zip file |

---

## Tool: TestAwsConnectionTool

Tests AWS connectivity using STS GetCallerIdentity. Returns true if the connection is successful.

```json
{ "region": "us-east-1" }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| region | string | No | AWS region to test (default: us-east-1) |

---

## Cross-Service Discovery Guide

Many AWS services produce logs, metrics, and resources that can be found through other services. Use this guide to navigate between related services.

### CloudWatch Log Group Naming Conventions

| AWS Service | Log Group Pattern | How to Find |
|-------------|-------------------|-------------|
| **Lambda** | `/aws/lambda/{functionName}` | Use `CloudWatchLogTool` with `DescribeLogGroups` prefix `/aws/lambda/` |
| **API Gateway** | `API-Gateway-Execution-Logs_{restApiId}/{stageName}` | Use `CloudWatchLogTool` with prefix `API-Gateway-Execution-Logs_` |
| **Glue** | `/aws-glue/jobs/output` | Use `CloudWatchLogTool` with prefix `/aws-glue/` |
| **RDS** | `/aws/rds/instance/{instanceId}/{logType}` | Use `CloudWatchLogTool` with prefix `/aws/rds/` |
| **ECS** | `/ecs/{serviceName}` or custom | Use `CloudWatchLogTool` with prefix `/ecs/` |
| **Step Functions** | `/aws/vendedlogs/states/{stateMachineName}` | Use `CloudWatchLogTool` with prefix `/aws/vendedlogs/states/` |
| **CloudTrail** | `aws-cloudtrail-logs-{accountId}` | Use `CloudWatchLogTool` with prefix `aws-cloudtrail-logs-` |
| **VPC Flow Logs** | Custom log group (check EC2 flow log config) | Use `EC2Tool` `DescribeFlowLogs` to find log group |

### Service Relationship Map

| From Service | Related Service | How to Navigate |
|-------------|----------------|-----------------|
| **Lambda Function** | CloudWatch Logs | Log group: `/aws/lambda/{functionName}` |
| **Lambda Function** | SQS/SNS/DynamoDB/Kinesis | Use `LambdaTool` `ListEventSourceMappings` to find event sources |
| **Lambda Function** | IAM Role | Check `GetFunctionConfiguration` for `Role` field |
| **EC2 Instance** | VPC, Subnet, Security Groups | Instance metadata contains `vpcId`, `subnetId`, `securityGroups` |
| **EC2 Instance** | CloudWatch | VPC Flow Logs → CloudWatch Log Group |
| **API Gateway** | Lambda | Integration targets in `GetIntegration` response |
| **API Gateway** | CloudWatch | Execution logs: `API-Gateway-Execution-Logs_{id}/{stage}` |
| **Glue Job** | CloudWatch Logs | Output logs: `/aws-glue/jobs/output` |
| **Glue Job** | S3 | Job scripts and data stored in S3 |
| **Step Functions** | Lambda/ECS/Glue/SNS/SQS/DynamoDB | Task states reference other services by ARN |
| **CloudFormation** | All Services | `DescribeStackResources` lists all managed resources |
| **CloudFormation** | Templates | `GetTemplate` returns the infrastructure definition |
| **IAM Role** | All Services | Roles are used by Lambda, EC2, Glue, Step Functions, etc. |
| **RDS** | RDS Data API | Use `RDSDataTool` for SQL execution on Aurora Serverless |
| **RDS** | CloudWatch | RDS logs → CloudWatch, Enhanced Monitoring → CloudWatch |
| **S3** | SNS/SQS/Lambda | Event notifications trigger other services |
| **SNS** | SQS/Lambda/HTTP | Subscriptions deliver to other service endpoints |
| **SQS** | Lambda | SQS queues as Lambda event sources |
| **SQS** | Dead Letter Queue | `ListDeadLetterSourceQueues` finds failed message sources |
| **EMR** | S3/EC2/CloudWatch | Clusters use S3 for data, EC2 for compute, CW for logs |

### Tips for Finding Related Resources
1. **Start with CloudFormation**: If infrastructure is managed by CloudFormation, use `DescribeStackResources` to discover all related resources in a stack
2. **Check IAM roles**: Use `IAMTool` `GetRole` and `ListAttachedRolePolicies` to understand what services a role can access
3. **Use tags**: Many services support tags — use tag-based queries to find related resources across services
4. **Follow ARNs**: When a service response includes ARNs to other resources, use the appropriate tool to inspect those resources
