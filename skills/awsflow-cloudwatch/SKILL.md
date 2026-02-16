---
name: awsflow-cloudwatch
description: Query and manage CloudWatch log groups, streams, events, run Insights queries, inspect metric filters and subscriptions, and open the interactive log viewer using awsflow. Find logs from Lambda, API Gateway, Glue, RDS, ECS, Step Functions, and other AWS services.
---

# Awsflow CloudWatch Logs

Query and manage CloudWatch log groups, streams, events, run Insights queries, and open the interactive log viewer.

## When to Use This Skill

Use this skill when the user:

- Asks about CloudWatch logs or log groups
- Wants to search log events or filter by pattern
- Needs to run CloudWatch Insights queries
- Wants to find logs from Lambda, API Gateway, Glue, or other services
- Needs to inspect metric filters, subscriptions, or query definitions
- Wants to open the interactive CloudWatch Log Viewer
- Needs to create, delete, or tag log groups and log streams
- Needs to configure retention policies or resource policies

## Tool: CloudWatchLogTool

Execute CloudWatch Logs commands including Insights queries. ALWAYS provide params object.

### Commands

#### DescribeLogGroups
List log groups with optional prefix filter.
```json
{ "command": "DescribeLogGroups", "params": { "logGroupNamePrefix": "/aws/lambda/", "limit": 50 } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| logGroupNamePrefix | string | No | Prefix filter for log group names |
| limit | number | No | Maximum items to return |
| nextToken | string | No | Pagination token |

#### DescribeLogStreams
List log streams in a log group.
```json
{ "command": "DescribeLogStreams", "params": { "logGroupName": "/aws/lambda/my-function", "orderBy": "LastEventTime", "descending": true, "limit": 10 } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| logGroupName | string | Yes | Target log group name |
| logStreamNamePrefix | string | No | Prefix filter for stream names |
| orderBy | string | No | `LogStreamName` or `LastEventTime` |
| descending | boolean | No | Sort in descending order |
| limit | number | No | Maximum items to return |
| nextToken | string | No | Pagination token |

#### GetLogEvents
Get log events from a specific stream.
```json
{ "command": "GetLogEvents", "params": { "logGroupName": "/aws/lambda/my-function", "logStreamName": "2024/01/01/[$LATEST]abc123", "limit": 100 } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| logGroupName | string | Yes | Target log group name |
| logStreamName | string | Yes | Target log stream name |
| startTime | number | No | Start time in epoch milliseconds |
| endTime | number | No | End time in epoch milliseconds |
| startFromHead | boolean | No | Start from the beginning of the stream |
| limit | number | No | Maximum events to return |
| nextToken | string | No | Pagination token |

#### FilterLogEvents
Search/filter log events across streams in a log group.
```json
{ "command": "FilterLogEvents", "params": { "logGroupName": "/aws/lambda/my-function", "filterPattern": "ERROR" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| logGroupName | string | Yes | Target log group name |
| filterPattern | string | No | Search pattern (e.g., `ERROR`, `"status code: 500"`, `{ $.level = "ERROR" }`) |
| startTime | number | No | Start time in epoch milliseconds |
| endTime | number | No | End time in epoch milliseconds |
| interleaved | boolean | No | Return interleaved results from multiple streams |
| nextToken | string | No | Pagination token |
| limit | number | No | Maximum events to return |

#### StartQuery
Start a CloudWatch Insights query.
```json
{
  "command": "StartQuery",
  "params": {
    "logGroupName": "/aws/lambda/my-function",
    "queryString": "fields @timestamp, @message | filter @message like /ERROR/ | sort @timestamp desc | limit 20",
    "startTime": 1704067200000,
    "endTime": 1704153600000
  }
}
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| logGroupName | string | No | Single log group name |
| logGroupNames | array of strings | No | Multiple log group names to query |
| logGroupIdentifiers | array of strings | No | Log group identifiers |
| queryString | string | Yes | CloudWatch Insights query string |
| startTime | number | Yes | Start time in epoch milliseconds |
| endTime | number | Yes | End time in epoch milliseconds |
| maxQueryResults | number | No | Maximum number of query results |

#### GetQueryResults
Get results of a CloudWatch Insights query.
```json
{ "command": "GetQueryResults", "params": { "queryId": "12345678-1234-1234-1234-123456789012" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| queryId | string | Yes | Query ID returned by `StartQuery` |

#### GetLogGroupFields
Discover fields in a log group for Insights queries.
```json
{ "command": "GetLogGroupFields", "params": { "logGroupName": "/aws/lambda/my-function" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| logGroupName | string | Yes | Target log group name |
| time | number | No | Time in epoch milliseconds for field discovery |

#### DescribeMetricFilters
List metric filters for a log group.
```json
{ "command": "DescribeMetricFilters", "params": { "logGroupName": "/aws/lambda/my-function" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| logGroupName | string | No | Target log group name |
| filterNamePrefix | string | No | Metric filter name prefix |
| metricName | string | No | Metric name |
| metricNamespace | string | No | Metric namespace |

#### DescribeQueryDefinitions
List saved CloudWatch Insights query definitions.
```json
{ "command": "DescribeQueryDefinitions", "params": {} }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| maxQueryResults | number | No | Maximum results |

#### DescribeSubscriptionFilters
List subscription filters for a log group.
```json
{ "command": "DescribeSubscriptionFilters", "params": { "logGroupName": "/aws/lambda/my-function" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| logGroupName | string | Yes | Target log group name |

#### DescribeDestinations
List log destinations.
```json
{ "command": "DescribeDestinations", "params": {} }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| destinationNamePrefix | string | No | Destination name prefix |

#### CreateLogGroup
Create a new log group.
```json
{ "command": "CreateLogGroup", "params": { "logGroupName": "/aws/lambda/new-func" } }
```

#### CreateLogStream
Create a new log stream in a log group.
```json
{ "command": "CreateLogStream", "params": { "logGroupName": "/aws/lambda/new-func", "logStreamName": "manual" } }
```

#### PutLogEvents
Put log events to a log stream.
```json
{ "command": "PutLogEvents", "params": { "logGroupName": "/aws/lambda/new-func", "logStreamName": "manual", "logEvents": [{ "timestamp": 1704067200000, "message": "hello" }] } }
```

#### PutRetentionPolicy
Set retention policy for a log group.
```json
{ "command": "PutRetentionPolicy", "params": { "logGroupName": "/aws/lambda/new-func", "retentionInDays": 30 } }
```

#### PutMetricFilter
Create or update a metric filter.
```json
{ "command": "PutMetricFilter", "params": { "logGroupName": "/aws/lambda/new-func", "filterName": "ErrorCount", "filterPattern": "ERROR", "metricTransformations": [{ "metricName": "ErrorCount", "metricNamespace": "App", "metricValue": "1" }] } }
```

#### PutSubscriptionFilter
Create or update a subscription filter.
```json
{ "command": "PutSubscriptionFilter", "params": { "logGroupName": "/aws/lambda/new-func", "filterName": "to-kinesis", "filterPattern": "", "destinationArn": "arn:aws:kinesis:..." } }
```

#### PutResourcePolicy
Create or update a resource policy.
```json
{ "command": "PutResourcePolicy", "params": { "policyName": "cw-policy", "policyDocument": "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":[\"logs:PutLogEvents\"],\"Resource\":[\"*\"]}]}" } }
```

#### DeleteLogGroup
Delete a log group.
```json
{ "command": "DeleteLogGroup", "params": { "logGroupName": "/aws/lambda/old-func" } }
```

#### DeleteLogStream
Delete a log stream.
```json
{ "command": "DeleteLogStream", "params": { "logGroupName": "/aws/lambda/new-func", "logStreamName": "manual" } }
```

#### DeleteMetricFilter
Delete a metric filter.
```json
{ "command": "DeleteMetricFilter", "params": { "logGroupName": "/aws/lambda/new-func", "filterName": "ErrorCount" } }
```

#### DeleteSubscriptionFilter
Delete a subscription filter.
```json
{ "command": "DeleteSubscriptionFilter", "params": { "logGroupName": "/aws/lambda/new-func", "filterName": "to-kinesis" } }
```

#### DeleteRetentionPolicy
Remove retention policy (reverts to Never Expire).
```json
{ "command": "DeleteRetentionPolicy", "params": { "logGroupName": "/aws/lambda/new-func" } }
```

#### DeleteResourcePolicy
Delete a resource policy.
```json
{ "command": "DeleteResourcePolicy", "params": { "policyName": "cw-policy" } }
```

#### TagLogGroup
Tag a log group.
```json
{ "command": "TagLogGroup", "params": { "logGroupName": "/aws/lambda/new-func", "tags": { "env": "prod" } } }
```

#### UntagLogGroup
Remove tags from a log group.
```json
{ "command": "UntagLogGroup", "params": { "logGroupName": "/aws/lambda/new-func", "tagKeys": ["env"] } }
```

#### OpenCloudWatchLogView
Open the interactive CloudWatch Log Viewer in VS Code.
```json
{ "command": "OpenCloudWatchLogView", "params": { "logGroupName": "/aws/lambda/my-function", "logStreamName": "2024/01/01/[$LATEST]abc123" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| logGroupName | string | Yes | Log group name to open |
| logStreamName | string | No | Specific log stream to open |

---

## CloudWatch Log Group Naming Conventions

Use these patterns to find logs from specific AWS services:

| AWS Service | Log Group Pattern | Example |
|-------------|-------------------|---------|
| **Lambda** | `/aws/lambda/{functionName}` | `/aws/lambda/my-api-handler` |
| **API Gateway** | `API-Gateway-Execution-Logs_{restApiId}/{stageName}` | `API-Gateway-Execution-Logs_abc123/prod` |
| **Glue** | `/aws-glue/jobs/output` | `/aws-glue/jobs/output` |
| **Glue** | `/aws-glue/jobs/error` | `/aws-glue/jobs/error` |
| **Glue Crawlers** | `/aws-glue/crawlers` | `/aws-glue/crawlers` |
| **RDS** | `/aws/rds/instance/{instanceId}/{logType}` | `/aws/rds/instance/mydb/error` |
| **RDS Aurora** | `/aws/rds/cluster/{clusterId}/{logType}` | `/aws/rds/cluster/mycluster/audit` |
| **ECS** | `/ecs/{serviceName}` or custom | `/ecs/my-service` |
| **Step Functions** | `/aws/vendedlogs/states/{name}` | `/aws/vendedlogs/states/MyStateMachine` |
| **CloudTrail** | `aws-cloudtrail-logs-{accountId}-{hash}` | `aws-cloudtrail-logs-123456789012-abcdef` |
| **VPC Flow Logs** | Custom (check EC2 flow log config) | `/vpc/flow-logs` |
| **AppSync** | `/aws/appsync/apis/{apiId}` | `/aws/appsync/apis/abc123` |
| **CodeBuild** | `/aws/codebuild/{projectName}` | `/aws/codebuild/my-build` |

### Useful Insights Query Examples

**Find errors across Lambda functions:**
```
fields @timestamp, @message
| filter @message like /ERROR/
| sort @timestamp desc
| limit 50
```

**Count errors by function:**
```
stats count(*) as errorCount by @logStream
| filter @message like /ERROR/
| sort errorCount desc
```

**Latency analysis:**
```
filter @type = "REPORT"
| stats avg(@duration) as avgDuration, max(@duration) as maxDuration, min(@duration) as minDuration by bin(1h)
```

---

## Related Services

- **CloudWatch → Lambda**: Lambda logs at `/aws/lambda/{functionName}`. Use `LambdaTool` `GetFunctionConfiguration` to get function details
- **CloudWatch → API Gateway**: Execution logs at `API-Gateway-Execution-Logs_{id}/{stage}`. Use `APIGatewayTool` `GetRestApis` to find API IDs
- **CloudWatch → Glue**: Job logs at `/aws-glue/jobs/output`. Use `GlueTool` `GetJobRuns` to correlate job runs with log timestamps
- **CloudWatch → RDS**: Database logs at `/aws/rds/instance/{id}/{type}`. Use `RDSTool` `DescribeDBInstances` to find instance IDs
- **CloudWatch → EC2**: VPC Flow Logs deliver to CloudWatch. Use `EC2Tool` `DescribeFlowLogs` to find log group
- **CloudWatch → Step Functions**: Execution logs at `/aws/vendedlogs/states/{name}`. Use `StepFuncTool` to find state machine details
