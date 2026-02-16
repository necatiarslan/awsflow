---
name: awsflow-cloudformation
description: Manage and inspect AWS CloudFormation stacks, resources, changesets, types, drift detection, and stack sets using the awsflow VS Code extension CloudFormationTool.
---

# awsflow-cloudformation

Use the **CloudFormationTool** language tool in VS Code to manage and inspect AWS CloudFormation stacks, resources, change sets, types, and drift status.

## When to Use
- User wants to list or describe CloudFormation stacks
- User wants to view stack resources, events, or outputs
- User wants to inspect change sets before applying them
- User wants to check stack drift status
- User wants to validate a template
- User wants to view stack set details or operations
- User wants to list or describe CloudFormation resource types
- User wants to estimate template cost
- User wants to create, update, or delete stacks or stack sets
- User wants to execute or delete change sets

## Tool Reference

**Tool name:** `CloudFormationTool`

### Input Schema

```json
{
  "command": "<CommandName>",
  "params": { ... }
}
```

### Commands (66 total)

| Command | Description |
|---------|-------------|
| BatchDescribeTypeConfigurations | Describe configurations for multiple resource types |
| DescribeAccountLimits | Get CloudFormation account limits |
| DescribeChangeSet | Describe a specific change set |
| DescribeChangeSetHooks | Describe hooks for a change set |
| DescribeGeneratedTemplate | Describe a generated template |
| DescribeOrganizationsAccess | Describe Organizations access status |
| DescribePublisher | Describe the calling account as a publisher |
| DescribeResourceScan | Describe a resource scan |
| DescribeStackDriftDetectionStatus | Check drift detection status for a stack |
| DescribeStackEvents | List events for a stack |
| DescribeStackInstance | Describe a stack instance in a stack set |
| DescribeStackRefactor | Describe a stack refactor operation |
| DescribeStackResource | Describe a specific stack resource |
| DescribeStackResourceDrifts | List resource drift results for a stack |
| DescribeStackResources | Describe all resources in a stack |
| DescribeStacks | Describe one or more stacks |
| DescribeStackSet | Describe a stack set |
| DescribeStackSetOperation | Describe an operation on a stack set |
| DescribeType | Describe a CloudFormation resource type |
| DescribeTypeRegistration | Describe a type registration |
| DetectStackDrift | Initiate drift detection on a stack |
| DetectStackResourceDrift | Detect drift on a specific resource |
| DetectStackSetDrift | Initiate drift detection on a stack set |
| EstimateTemplateCost | Estimate cost for a template |
| GetGeneratedTemplate | Retrieve a generated template |
| GetHookResult | Get result of a hook invocation |
| GetStackPolicy | Get the stack policy for a stack |
| GetTemplate | Get the template body for a stack |
| GetTemplateSummary | Get template metadata and parameters |
| ListChangeSets | List change sets for a stack |
| ListExports | List exported output values |
| ListGeneratedTemplates | List generated templates |
| ListHookResults | List hook results |
| ListImports | List stacks importing an export |
| ListResourceScanRelatedResources | List related resources from a scan |
| ListResourceScanResources | List resources from a scan |
| ListResourceScans | List resource scans |
| ListStackInstanceResourceDrifts | List instance resource drifts |
| ListStackInstances | List instances in a stack set |
| ListStackRefactorActions | List refactor actions |
| ListStackRefactors | List stack refactors |
| ListStackResources | List resources in a stack |
| ListStacks | List all stacks (with status filter) |
| ListStackSetAutoDeploymentTargets | List auto-deployment targets |
| ListStackSetOperationResults | List results of a stack set operation |
| ListStackSetOperations | List operations on a stack set |
| ListStackSets | List all stack sets |
| ListTypeRegistrations | List type registrations |
| ListTypes | List registered resource types |
| ListTypeVersions | List versions of a type |
| ValidateTemplate | Validate a CloudFormation template |
| CreateStack | Create a new stack |
| CreateChangeSet | Create a change set |
| ExecuteChangeSet | Execute a change set |
| CreateStackSet | Create a stack set |
| CreateStackInstances | Create stack instances for a stack set |
| UpdateStack | Update a stack |
| UpdateStackSet | Update a stack set |
| DeleteStack | Delete a stack |
| DeleteChangeSet | Delete a change set |
| DeleteStackSet | Delete a stack set |
| DeleteStackInstances | Delete stack set instances |
| ContinueUpdateRollback | Continue a rollback after update failure |
| CancelUpdateStack | Cancel a stack update |
| SetStackPolicy | Set or update a stack policy |
| UpdateTerminationProtection | Enable or disable termination protection |

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| StackName | string | Stack name or ID (Required by: DescribeStacks, DescribeStackResources, DescribeStackEvents, DescribeStackDriftDetectionStatus, GetStackPolicy, GetTemplate, GetTemplateSummary, ListStackResources, DetectStackDrift) |
| StackSetName | string | Stack set name or ID (Required by: DescribeStackSet, DescribeStackSetOperation, ListStackSetAutoDeploymentTargets, ListStackSetOperationResults, ListStackSetOperations, DetectStackSetDrift, ListStackInstances) |
| ChangeSetName | string | Change set name or ID (Required by: DescribeChangeSet, ListChangeSets) |
| TypeName | string | Resource type name (Required by: DescribeType, ListTypeVersions, DescribeTypeRegistration) |
| TypeArn | string | Resource type ARN (Required by: DescribeType) |
| NextToken | string | Pagination token (Used by: most List commands) |
| MaxResults | number | Maximum records to return (Used by: most List commands) |

## Usage Examples

### List all stacks
```json
{ "command": "ListStacks", "params": {} }
```

### Describe a specific stack
```json
{ "command": "DescribeStacks", "params": { "StackName": "my-app-stack" } }
```

### View stack resources
```json
{ "command": "DescribeStackResources", "params": { "StackName": "my-app-stack" } }
```

### View stack events
```json
{ "command": "DescribeStackEvents", "params": { "StackName": "my-app-stack" } }
```

### Get template body
```json
{ "command": "GetTemplate", "params": { "StackName": "my-app-stack" } }
```

### Get template summary
```json
{ "command": "GetTemplateSummary", "params": { "StackName": "my-app-stack" } }
```

### List change sets for a stack
```json
{ "command": "ListChangeSets", "params": { "ChangeSetName": "my-app-stack" } }
```

### Detect drift on a stack
```json
{ "command": "DetectStackDrift", "params": { "StackName": "my-app-stack" } }
```

### Describe resource drift results
```json
{ "command": "DescribeStackResourceDrifts", "params": { "StackName": "my-app-stack" } }
```

### Validate a template
```json
{ "command": "ValidateTemplate", "params": {} }
```

### List exported values
```json
{ "command": "ListExports", "params": {} }
```

### Describe a stack set
```json
{ "command": "DescribeStackSet", "params": { "StackSetName": "my-stack-set" } }
```

### List registered resource types
```json
{ "command": "ListTypes", "params": {} }
```

## Related Services

CloudFormation manages infrastructure for virtually every AWS service. Related awsflow tools:

| Relationship | Tool |
|-------------|------|
| Stacks create S3 buckets | `S3Tool` / `S3FileOperationsTool` |
| Stacks create Lambda functions | `LambdaTool` |
| Stacks create DynamoDB tables | `DynamoDBTool` |
| Stacks create EC2 instances | `EC2Tool` |
| Stacks create IAM roles/policies | `IAMTool` |
| Stacks create RDS databases | `RDSTool` / `RDSDataTool` |
| Stacks create SNS topics | `SNSTool` |
| Stacks create SQS queues | `SQSTool` |
| Stacks create Step Functions | `StepFuncTool` |
| Stacks create API Gateways | `APIGatewayTool` |
| Stacks create Glue jobs | `GlueTool` |
| Stacks create EMR clusters | `EMRTool` |
| Stack events in CloudWatch | `CloudWatchLogTool` |
| Verify identity & permissions | `STSTool` |

### Tips
- Use `ListStacks` to get an overview, then `DescribeStacks` with a specific `StackName` for details.
- Use `GetTemplate` to retrieve the actual template body of a deployed stack.
- Use `DetectStackDrift` → `DescribeStackResourceDrifts` to check if resources have drifted from the template.
- `ListExports` + `ListImports` helps trace cross-stack dependencies.
- `ValidateTemplate` checks template syntax without deploying.
