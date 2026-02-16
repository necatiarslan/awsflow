---
name: awsflow-stepfunc
description: Manage and run AWS Step Functions state machines, executions, and activities using the awsflow VS Code extension StepFuncTool.
---

# awsflow-stepfunc

Use the **StepFuncTool** language tool in VS Code to manage AWS Step Functions state machines, executions, activities, and lifecycle operations.

## When to Use
- User wants to list or describe state machines
- User wants to start a new execution or inspect existing executions
- User wants to view execution history (step-by-step events)
- User wants to update a state machine definition
- User wants to validate a state machine definition
- User wants to list or describe activities and map runs
- User wants to create or delete state machines and activities
- User wants to stop executions or manage tags and aliases

## Tool Reference

**Tool name:** `StepFuncTool`

### Input Schema

```json
{
  "command": "<CommandName>",
  "params": { ... }
}
```

### Commands (28 total)

| Command | Description |
|---------|-------------|
| DescribeActivity | Describe an activity |
| DescribeExecution | Describe a specific execution |
| DescribeMapRun | Describe a Map Run |
| DescribeStateMachine | Describe a state machine |
| DescribeStateMachineAlias | Describe a state machine alias |
| DescribeStateMachineForExecution | Describe state machine associated with an execution |
| GetExecutionHistory | Get the step-by-step event history of an execution |
| ListActivities | List activities |
| ListExecutions | List executions for a state machine |
| ListMapRuns | List Map Runs for an execution |
| ListStateMachineAliases | List aliases for a state machine |
| ListStateMachines | List all state machines |
| ListStateMachineVersions | List versions of a state machine |
| StartExecution | Start a new execution of a state machine |
| UpdateStateMachine | Update a state machine definition, role, or configuration |
| ValidateStateMachineDefinition | Validate an Amazon States Language definition |
| CreateStateMachine | Create a new state machine |
| CreateActivity | Create an activity |
| CreateStateMachineAlias | Create a state machine alias |
| PublishStateMachineVersion | Publish a state machine version |
| TagResource | Tag a state machine or activity |
| UntagResource | Remove tags from a resource |
| DeleteStateMachine | Delete a state machine |
| DeleteActivity | Delete an activity |
| StopExecution | Stop a running execution |
| UpdateStateMachineAlias | Update a state machine alias |
| DeleteStateMachineAlias | Delete a state machine alias |
| DeleteStateMachineVersion | Delete a state machine version |

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| stateMachineArn | string | State machine ARN (Required by: DescribeStateMachine, StartExecution, UpdateStateMachine; Used by: ListExecutions) |
| executionArn | string | Execution ARN (Required by: DescribeExecution, GetExecutionHistory) |
| maxResults | number | Maximum items to return (Used by: ListExecutions, ListStateMachines, GetExecutionHistory) |
| nextToken | string | Pagination token (Used by: ListExecutions, ListStateMachines, GetExecutionHistory) |
| reverseOrder | boolean | Return events in reverse chronological order (Used by: GetExecutionHistory) |
| statusFilter | string | Filter executions by status. Enum: `RUNNING`, `SUCCEEDED`, `FAILED`, `TIMED_OUT`, `ABORTED` (Used by: ListExecutions) |
| name | string | Execution name (Used by: StartExecution) |
| input | string | JSON string input for execution (Used by: StartExecution) |
| traceHeader | string | X-Ray trace header (Used by: StartExecution) |
| definition | string | State machine definition in Amazon States Language (Used by: UpdateStateMachine) |
| roleArn | string | IAM role ARN for the state machine (Used by: UpdateStateMachine) |
| loggingConfiguration | object | Logging configuration object (Used by: UpdateStateMachine) |
| tracingConfiguration | object | Tracing configuration object (Used by: UpdateStateMachine) |
| publish | boolean | Set true to publish a new version (Used by: UpdateStateMachine) |
| versionDescription | string | Description for the published version (Used by: UpdateStateMachine) |

## Usage Examples

### List all state machines
```json
{ "command": "ListStateMachines", "params": { "maxResults": 20 } }
```

### Describe a state machine
```json
{ "command": "DescribeStateMachine", "params": { "stateMachineArn": "arn:aws:states:us-east-1:123456789012:stateMachine:MyWorkflow" } }
```

### List executions with status filter
```json
{ "command": "ListExecutions", "params": { "stateMachineArn": "arn:aws:states:us-east-1:123456789012:stateMachine:MyWorkflow", "statusFilter": "FAILED", "maxResults": 10 } }
```

### Start a new execution
```json
{ "command": "StartExecution", "params": { "stateMachineArn": "arn:aws:states:us-east-1:123456789012:stateMachine:MyWorkflow", "input": "{\"orderId\": \"12345\", \"amount\": 99.99}" } }
```

### Get execution history
```json
{ "command": "GetExecutionHistory", "params": { "executionArn": "arn:aws:states:us-east-1:123456789012:execution:MyWorkflow:exec-id", "maxResults": 100, "reverseOrder": true } }
```

### Describe an execution
```json
{ "command": "DescribeExecution", "params": { "executionArn": "arn:aws:states:us-east-1:123456789012:execution:MyWorkflow:exec-id" } }
```

### Update state machine definition
```json
{ "command": "UpdateStateMachine", "params": { "stateMachineArn": "arn:aws:states:us-east-1:123456789012:stateMachine:MyWorkflow", "definition": "{\"StartAt\": \"Step1\", \"States\": { \"Step1\": { \"Type\": \"Pass\", \"End\": true }}}" } }
```

### Validate a definition
```json
{ "command": "ValidateStateMachineDefinition", "params": {} }
```

### Create a state machine
```json
{ "command": "CreateStateMachine", "params": { "name": "MyWorkflow", "definition": "{\"StartAt\":\"Step1\",\"States\":{\"Step1\":{\"Type\":\"Pass\",\"End\":true}}}", "roleArn": "arn:aws:iam::123456789012:role/StepFuncRole" } }
```

### Stop an execution
```json
{ "command": "StopExecution", "params": { "executionArn": "arn:aws:states:...:execution:MyWorkflow:exec-id", "cause": "manual stop" } }
```

## Related Services

Step Functions orchestrates workflows across many AWS services:

| Relationship | Tool |
|-------------|------|
| Invokes Lambda functions | `LambdaTool` |
| Sends messages to SQS | `SQSTool` |
| Publishes to SNS topics | `SNSTool` |
| Reads/writes DynamoDB tables | `DynamoDBTool` |
| Starts Glue jobs | `GlueTool` |
| Starts EMR steps | `EMRTool` |
| Calls API Gateway endpoints | `APIGatewayTool` |
| Execution logs in CloudWatch | `CloudWatchLogTool` |
| IAM roles for execution | `IAMTool` |
| Deployed via CloudFormation | `CloudFormationTool` |

### CloudWatch Log Group Naming
Step Functions log groups typically follow:
```
/aws/vendedlogs/states/<state-machine-name>-Logs
```
Use `CloudWatchLogTool` → `DescribeLogGroups` with `logGroupNamePrefix: "/aws/vendedlogs/states/"` to find them.

### Tips
- Use `ListStateMachines` → `DescribeStateMachine` to explore definition and configuration.
- Use `ListExecutions` with `statusFilter: "FAILED"` to find failed runs, then `GetExecutionHistory` to debug step-by-step.
- `StartExecution` requires `stateMachineArn` and accepts a JSON `input` string.
- The `definition` in `UpdateStateMachine` must be valid Amazon States Language JSON.
- Use `reverseOrder: true` in `GetExecutionHistory` to see the most recent events first.
