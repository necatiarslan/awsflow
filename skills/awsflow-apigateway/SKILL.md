---
name: awsflow-apigateway
description: Manage and inspect AWS API Gateway REST APIs, resources, methods, stages, authorizers, usage plans, and domain names using the awsflow VS Code extension APIGatewayTool.
---

# awsflow-apigateway

Use the **APIGatewayTool** language tool in VS Code to manage, inspect, and test AWS API Gateway REST APIs — resources, methods, integrations, stages, authorizers, usage plans, and more.

## When to Use
- User wants to list or inspect REST APIs
- User wants to view API resources, methods, and integrations
- User wants to inspect stages, deployments, or stage variables
- User wants to view or test authorizers
- User wants to test invoke a method without deploying
- User wants to inspect usage plans, API keys, or quotas
- User wants to view custom domain names, base path mappings, or VPC links
- User wants to view models, request validators, or documentation
- User wants to export an API or get SDK artifacts
- User wants to create or delete APIs, resources, stages, authorizers, or usage plans
- User wants to update API definitions or stage settings

## Tool Reference

**Tool name:** `APIGatewayTool`

### Input Schema

```json
{
  "command": "<CommandName>",
  "params": { ... }
}
```

### Commands (68 total)

| Command | Description |
|---------|-------------|
| GetAccount | Get API Gateway account settings |
| GetApiKey | Get a specific API key |
| GetApiKeys | List API keys |
| GetAuthorizer | Get a specific authorizer |
| GetAuthorizers | List authorizers for an API |
| GetBasePathMapping | Get a base path mapping |
| GetBasePathMappings | List base path mappings for a domain |
| GetClientCertificate | Get a specific client certificate |
| GetClientCertificates | List client certificates |
| GetDeployment | Get a specific deployment |
| GetDeployments | List deployments for an API |
| GetDocumentationPart | Get a documentation part |
| GetDocumentationParts | List documentation parts |
| GetDocumentationVersion | Get a documentation version |
| GetDocumentationVersions | List documentation versions |
| GetDomainName | Get a custom domain name |
| GetDomainNames | List custom domain names |
| GetExport | Export an API as a Swagger/OAS file |
| GetGatewayResponse | Get a gateway response |
| GetGatewayResponses | List gateway responses |
| GetIntegration | Get integration for a method |
| GetIntegrationResponse | Get integration response |
| GetMethod | Get a specific method |
| GetMethodResponse | Get a method response |
| GetModel | Get a specific model |
| GetModels | List models for an API |
| GetRequestValidator | Get a request validator |
| GetRequestValidators | List request validators |
| GetResource | Get a specific resource |
| GetResources | List resources for an API |
| GetRestApi | Get a specific REST API |
| GetRestApis | List all REST APIs |
| GetSdk | Get SDK for an API stage |
| GetSdkType | Get an SDK type |
| GetSdkTypes | List available SDK types |
| GetStage | Get a specific stage |
| GetStages | List stages for an API |
| GetTags | Get tags for a resource |
| GetUsage | Get usage data for a plan |
| GetUsagePlan | Get a specific usage plan |
| GetUsagePlanKey | Get a specific usage plan key |
| GetUsagePlanKeys | List keys for a usage plan |
| GetUsagePlans | List usage plans |
| GetVpcLink | Get a specific VPC link |
| GetVpcLinks | List VPC links |
| TestInvokeAuthorizer | Test invoke an authorizer |
| TestInvokeMethod | Test invoke a method |
| CreateRestApi | Create a REST API |
| CreateResource | Create a resource under a REST API |
| PutMethod | Create or update a method on a resource |
| CreateDeployment | Create a deployment |
| CreateStage | Create a stage |
| CreateAuthorizer | Create an authorizer |
| CreateApiKey | Create an API key |
| CreateUsagePlan | Create a usage plan |
| CreateDomainName | Create a custom domain name |
| ImportRestApi | Import a REST API from Swagger/OAS |
| DeleteRestApi | Delete a REST API |
| DeleteResource | Delete a resource |
| DeleteMethod | Delete a method |
| DeleteStage | Delete a stage |
| DeleteAuthorizer | Delete an authorizer |
| DeleteApiKey | Delete an API key |
| DeleteUsagePlan | Delete a usage plan |
| DeleteDomainName | Delete a custom domain name |
| UpdateRestApi | Update a REST API |
| UpdateStage | Update a stage |
| TagResource | Tag an API Gateway resource |
| UntagResource | Remove tags from a resource |

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| restApiId | string | REST API identifier (Required by: most Get commands that operate on a specific API) |
| resourceId | string | Resource ID (Required by: GetIntegration, GetIntegrationResponse, GetMethod, GetMethodResponse, GetResource, TestInvokeMethod) |
| httpMethod | string | HTTP method — GET, POST, PUT, DELETE, etc. (Required by: GetIntegration, GetIntegrationResponse, GetMethod, GetMethodResponse, TestInvokeMethod) |
| stageName | string | Stage name (Required by: GetStage) |
| authorizerId | string | Authorizer ID (Required by: GetAuthorizer, TestInvokeAuthorizer) |
| usagePlanId | string | Usage plan ID (Required by: GetUsagePlan, GetUsagePlanKey, GetUsagePlanKeys) |
| keyId | string | Usage plan key ID (Required by: GetUsagePlanKey) |
| domainName | string | Custom domain name (Required by: GetDomainName, GetBasePathMapping, GetBasePathMappings) |
| statusCode | string | Status code for GetMethodResponse (Required by: GetMethodResponse) |
| limit | number | Maximum results for list operations (Used by: all list/get-multiple commands) |
| position | string | Pagination position token (Used by: all list/get-multiple commands) |
| name | string | Name filter (Used by: GetApiKeys, GetRestApis) |
| headers | object | Request headers for test invocation (Used by: TestInvokeMethod, TestInvokeAuthorizer) |
| multiValueHeaders | object | Multi-value headers for test invocation (Used by: TestInvokeMethod, TestInvokeAuthorizer) |
| pathWithQueryString | string | Path with query string for test invocation (Used by: TestInvokeMethod, TestInvokeAuthorizer) |
| body | string | Request body for test invocation (Used by: TestInvokeMethod, TestInvokeAuthorizer) |
| stageVariables | object | Stage variables for test invocation (Used by: TestInvokeMethod, TestInvokeAuthorizer) |
| additionalContext | object | Additional context for authorizer test (Used by: TestInvokeAuthorizer) |
| includeCredentials | boolean | Include credentials in export (Used by: GetExport) |

## Usage Examples

### List all REST APIs
```json
{ "command": "GetRestApis", "params": { "limit": 25 } }
```

### Get details of a specific API
```json
{ "command": "GetRestApi", "params": { "restApiId": "abc123def" } }
```

### List resources for an API
```json
{ "command": "GetResources", "params": { "restApiId": "abc123def", "limit": 100 } }
```

### Get a specific method
```json
{ "command": "GetMethod", "params": { "restApiId": "abc123def", "resourceId": "xyz789", "httpMethod": "GET" } }
```

### Get integration details
```json
{ "command": "GetIntegration", "params": { "restApiId": "abc123def", "resourceId": "xyz789", "httpMethod": "POST" } }
```

### List stages
```json
{ "command": "GetStages", "params": { "restApiId": "abc123def" } }
```

### Get a specific stage
```json
{ "command": "GetStage", "params": { "restApiId": "abc123def", "stageName": "prod" } }
```

### List deployments
```json
{ "command": "GetDeployments", "params": { "restApiId": "abc123def", "limit": 10 } }
```

### Test invoke a method
```json
{ "command": "TestInvokeMethod", "params": { "restApiId": "abc123def", "resourceId": "xyz789", "httpMethod": "GET", "pathWithQueryString": "/items?category=books" } }
```

### Test invoke a method with body
```json
{ "command": "TestInvokeMethod", "params": { "restApiId": "abc123def", "resourceId": "xyz789", "httpMethod": "POST", "pathWithQueryString": "/items", "body": "{\"name\": \"test\", \"price\": 9.99}", "headers": { "Content-Type": "application/json" } } }
```

### Test invoke an authorizer
```json
{ "command": "TestInvokeAuthorizer", "params": { "restApiId": "abc123def", "authorizerId": "auth001", "headers": { "Authorization": "Bearer eyJ..." } } }
```

### List authorizers
```json
{ "command": "GetAuthorizers", "params": { "restApiId": "abc123def" } }
```

### List usage plans
```json
{ "command": "GetUsagePlans", "params": { "limit": 10 } }
```

### List API keys
```json
{ "command": "GetApiKeys", "params": { "limit": 20 } }
```

### Get custom domain names
```json
{ "command": "GetDomainNames", "params": { "limit": 10 } }
```

### Get VPC links
```json
{ "command": "GetVpcLinks", "params": { "limit": 10 } }
```

## Related Services

API Gateway integrates with many AWS services:

| Relationship | Tool |
|-------------|------|
| Lambda integrations (proxy/custom) | `LambdaTool` |
| Execution logs in CloudWatch | `CloudWatchLogTool` |
| IAM authorizers & execution roles | `IAMTool` |
| Deployed via CloudFormation | `CloudFormationTool` |
| Orchestrated by Step Functions | `StepFuncTool` |
| Backend on EC2 / VPC link targets | `EC2Tool` |
| DynamoDB direct integrations | `DynamoDBTool` |
| SNS direct integrations | `SNSTool` |
| SQS direct integrations | `SQSTool` |

### CloudWatch Log Group Naming
API Gateway execution logs use these log group patterns:
```
API-Gateway-Execution-Logs_<restApiId>/<stageName>
```
Access logs are configured per-stage and can go to a custom log group.

Use `CloudWatchLogTool` → `DescribeLogGroups` with `logGroupNamePrefix: "API-Gateway-Execution-Logs_"` to find them.

### Tips
- Start with `GetRestApis` to discover APIs, then `GetResources` to see the resource tree.
- Use `GetMethod` → `GetIntegration` to see how a method is wired to a backend.
- `TestInvokeMethod` lets you test an API method without needing a deployment or stage — great for debugging.
- `TestInvokeAuthorizer` validates authorizer behavior without making a real API call.
- `GetStages` shows deployment history and stage variables for each stage.
- Use `GetUsagePlans` + `GetUsagePlanKeys` to audit API key throttling and quotas.
