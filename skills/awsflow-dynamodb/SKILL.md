---
name: awsflow-dynamodb
description: Manage Amazon DynamoDB tables and items using awsflow. Create/delete/update tables, query and scan data, CRUD operations on items, manage TTL, backups, global tables, auto-scaling, and tags.
---

# Awsflow DynamoDB

Manage DynamoDB tables and items through the awsflow DynamoDBTool.

## When to Use This Skill

Use this skill when the user:

- Asks about DynamoDB tables or items
- Wants to query or scan DynamoDB data
- Needs to create, update, or delete tables
- Wants to perform CRUD operations on items (get, put, update, delete)
- Asks about TTL, backups, global tables, or auto-scaling
- Needs to manage table tags

## Tool: DynamoDBTool

Execute DynamoDB commands. ALWAYS provide params object.

### Commands

#### ListTables
List DynamoDB tables.
```json
{ "command": "ListTables", "params": { "Limit": 100 } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Limit | number | No | Maximum number of tables to return |
| ExclusiveStartTableName | string | No | Pagination start table name |

#### DescribeTable
Get detailed information about a table.
```json
{ "command": "DescribeTable", "params": { "TableName": "my-table" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| TableName | string | Yes | Target table name |

#### DescribeTimeToLive
Get TTL settings for a table.
```json
{ "command": "DescribeTimeToLive", "params": { "TableName": "my-table" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| TableName | string | Yes | Target table name |

#### DescribeContinuousBackups
Get continuous backup and point-in-time recovery status.
```json
{ "command": "DescribeContinuousBackups", "params": { "TableName": "my-table" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| TableName | string | Yes | Target table name |

#### DescribeTableReplicaAutoScaling
Get auto-scaling settings for table replicas.
```json
{ "command": "DescribeTableReplicaAutoScaling", "params": { "TableName": "my-table" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| TableName | string | Yes | Target table name |

#### Query
Query items by primary key with optional filter expressions.
```json
{
  "command": "Query",
  "params": {
    "TableName": "my-table",
    "KeyConditionExpression": "pk = :pk AND begins_with(sk, :prefix)",
    "ExpressionAttributeValues": { ":pk": { "S": "user-123" }, ":prefix": { "S": "order#" } },
    "Limit": 25
  }
}
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| TableName | string | Yes | Target table name |
| KeyConditionExpression | string | Yes (for Query) | Key condition expression |
| FilterExpression | string | No | Filter expression applied after query |
| ExpressionAttributeValues | object | No | Expression attribute values map (DynamoDB typed: `{"S":"string"}`, `{"N":"123"}`, `{"BOOL":true}`) |
| ExpressionAttributeNames | object | No | Expression attribute names map (for reserved words) |
| IndexName | string | No | Secondary index name (GSI or LSI) |
| Select | string | No | Projection selection (`ALL_ATTRIBUTES`, `ALL_PROJECTED_ATTRIBUTES`, `COUNT`, `SPECIFIC_ATTRIBUTES`) |
| Limit | number | No | Maximum items to return |

#### Scan
Scan all items in a table with optional filter.
```json
{
  "command": "Scan",
  "params": {
    "TableName": "my-table",
    "FilterExpression": "age > :minAge",
    "ExpressionAttributeValues": { ":minAge": { "N": "30" } },
    "Limit": 100
  }
}
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| TableName | string | Yes | Target table name |
| FilterExpression | string | No | Filter expression |
| ExpressionAttributeValues | object | No | Expression attribute values map |
| ExpressionAttributeNames | object | No | Expression attribute names map |
| IndexName | string | No | Secondary index name |
| Select | string | No | Projection selection |
| Limit | number | No | Maximum items to return |

#### GetItem
Get a single item by primary key.
```json
{
  "command": "GetItem",
  "params": {
    "TableName": "my-table",
    "Key": { "pk": { "S": "user-123" }, "sk": { "S": "profile" } }
  }
}
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| TableName | string | Yes | Target table name |
| Key | object | Yes | Primary key map (DynamoDB typed values) |

#### PutItem
Create or replace an item.
```json
{
  "command": "PutItem",
  "params": {
    "TableName": "my-table",
    "Item": { "pk": { "S": "user-123" }, "sk": { "S": "profile" }, "name": { "S": "John" } }
  }
}
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| TableName | string | Yes | Target table name |
| Item | object | Yes | Item attributes map (DynamoDB typed values) |
| ConditionExpression | string | No | Condition expression for conditional writes |
| ExpressionAttributeValues | object | No | Expression attribute values |
| ExpressionAttributeNames | object | No | Expression attribute names |

#### UpdateItem
Update attributes of an existing item.
```json
{
  "command": "UpdateItem",
  "params": {
    "TableName": "my-table",
    "Key": { "pk": { "S": "user-123" }, "sk": { "S": "profile" } },
    "UpdateExpression": "SET #n = :name, age = :age",
    "ExpressionAttributeNames": { "#n": "name" },
    "ExpressionAttributeValues": { ":name": { "S": "Jane" }, ":age": { "N": "25" } }
  }
}
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| TableName | string | Yes | Target table name |
| Key | object | Yes | Primary key map |
| UpdateExpression | string | No | Update expression (SET, REMOVE, ADD, DELETE) |
| ConditionExpression | string | No | Condition expression |
| ExpressionAttributeValues | object | No | Expression attribute values |
| ExpressionAttributeNames | object | No | Expression attribute names |
| AttributeUpdates | object | No | Legacy attribute updates map |

#### DeleteItem
Delete an item by primary key.
```json
{
  "command": "DeleteItem",
  "params": {
    "TableName": "my-table",
    "Key": { "pk": { "S": "user-123" }, "sk": { "S": "profile" } }
  }
}
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| TableName | string | Yes | Target table name |
| Key | object | Yes | Primary key map |
| ConditionExpression | string | No | Condition expression |
| ExpressionAttributeValues | object | No | Expression attribute values |
| ExpressionAttributeNames | object | No | Expression attribute names |

#### CreateTable
Create a new DynamoDB table.
```json
{
  "command": "CreateTable",
  "params": {
    "TableName": "new-table",
    "KeySchema": [{ "AttributeName": "pk", "KeyType": "HASH" }, { "AttributeName": "sk", "KeyType": "RANGE" }],
    "AttributeDefinitions": [{ "AttributeName": "pk", "AttributeType": "S" }, { "AttributeName": "sk", "AttributeType": "S" }],
    "BillingMode": "PAY_PER_REQUEST"
  }
}
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| TableName | string | Yes | Table name |
| KeySchema | array of objects | Yes | Key schema definitions (`HASH` and optional `RANGE`) |
| AttributeDefinitions | array of objects | Yes | Attribute definitions (`S`, `N`, `B`) |
| BillingMode | string | No | `PROVISIONED` or `PAY_PER_REQUEST` |
| ProvisionedThroughput | object | No | Read/write capacity units (required for PROVISIONED) |
| ExpressionAttributeNames | object | No | Expression attribute names |

#### DeleteTable
Delete a DynamoDB table.
```json
{ "command": "DeleteTable", "params": { "TableName": "old-table" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| TableName | string | Yes | Table name to delete |

#### UpdateTable
Update table settings (billing, GSIs, etc.).
```json
{ "command": "UpdateTable", "params": { "TableName": "my-table", "BillingMode": "PAY_PER_REQUEST" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| TableName | string | Yes | Table name |
| BillingMode | string | No | `PROVISIONED` or `PAY_PER_REQUEST` |
| ProvisionedThroughput | object | No | Provisioned throughput config |
| GlobalSecondaryIndexUpdates | array of objects | No | Updates to GSIs |

#### UpdateTimeToLive
Enable or disable TTL on a table.
```json
{
  "command": "UpdateTimeToLive",
  "params": {
    "TableName": "my-table",
    "TimeToLiveSpecification": { "AttributeName": "ttl", "Enabled": true }
  }
}
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| TableName | string | Yes | Table name |
| TimeToLiveSpecification | object | Yes | TTL specification with `AttributeName` and `Enabled` |

#### ListBackups
List DynamoDB table backups.
```json
{ "command": "ListBackups", "params": {} }
```
**Parameters:** None required.

#### ListGlobalTables
List global tables.
```json
{ "command": "ListGlobalTables", "params": {} }
```
**Parameters:** None required.

#### ListTagsOfResource
List tags for a DynamoDB resource.
```json
{ "command": "ListTagsOfResource", "params": { "ResourceArn": "arn:aws:dynamodb:..." } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ResourceArn | string | Yes | Table resource ARN |

#### CreateBackup
Create an on-demand backup.
```json
{ "command": "CreateBackup", "params": { "TableName": "my-table", "BackupName": "daily-2026-02-15" } }
```

#### DescribeBackup
Get details of a backup.
```json
{ "command": "DescribeBackup", "params": { "BackupArn": "arn:aws:dynamodb:...:backup/backup-id" } }
```

#### DeleteBackup
Delete a backup.
```json
{ "command": "DeleteBackup", "params": { "BackupArn": "arn:aws:dynamodb:...:backup/backup-id" } }
```

#### RestoreTableFromBackup
Restore a table from a backup.
```json
{ "command": "RestoreTableFromBackup", "params": { "TargetTableName": "restored-table", "BackupArn": "arn:aws:dynamodb:...:backup/backup-id" } }
```

#### CreateGlobalTable
Create a global table.
```json
{ "command": "CreateGlobalTable", "params": { "GlobalTableName": "global-table", "ReplicationGroup": [{ "RegionName": "us-east-1" }, { "RegionName": "us-west-2" }] } }
```

#### UpdateGlobalTable
Update a global table replication group.
```json
{ "command": "UpdateGlobalTable", "params": { "GlobalTableName": "global-table", "ReplicaUpdates": [{ "Create": { "RegionName": "eu-west-1" } }] } }
```

#### TagResource
Tag a DynamoDB resource.
```json
{ "command": "TagResource", "params": { "ResourceArn": "arn:aws:dynamodb:...", "Tags": [{ "Key": "env", "Value": "prod" }] } }
```

#### UntagResource
Remove tags from a DynamoDB resource.
```json
{ "command": "UntagResource", "params": { "ResourceArn": "arn:aws:dynamodb:...", "TagKeys": ["env"] } }
```

---

## Related Services

- **DynamoDB → Lambda**: DynamoDB Streams trigger Lambda functions. Use `LambdaTool` `ListEventSourceMappings` to find stream-triggered functions
- **DynamoDB → CloudWatch**: DynamoDB metrics (read/write capacity, throttling) are in CloudWatch Metrics
- **DynamoDB → IAM**: Table access controlled by IAM policies. Use `IAMTool` `SimulatePrincipalPolicy` to test access
- **DynamoDB → CloudFormation**: Tables managed by CloudFormation — use `CloudFormationTool` `DescribeStackResources`
- **DynamoDB → S3**: DynamoDB backups can be exported to S3
