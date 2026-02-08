---
name: awsflow-rdsdata
description: Run SQL queries and manage transactions on Amazon Aurora Serverless and RDS clusters with Data API enabled using awsflow. Execute statements, batch operations, and transaction management.
---

# Awsflow RDS Data

Run SQL and manage transactions via the Amazon RDS Data API for Aurora Serverless and RDS clusters with Data API enabled.

## When to Use This Skill

Use this skill when the user:

- Wants to execute SQL queries against Aurora Serverless
- Needs to run SQL on RDS clusters with Data API enabled
- Wants to manage database transactions (begin, commit, rollback)
- Needs to run batch SQL operations
- Asks about the RDS Data API

## Tool: RDSDataTool

Execute Amazon RDS Data API commands. ALWAYS provide params object.

### Commands

#### ExecuteStatement
Execute a single SQL statement.
```json
{
  "command": "ExecuteStatement",
  "params": {
    "resourceArn": "arn:aws:rds:us-east-1:123456789012:cluster:my-cluster",
    "secretArn": "arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret",
    "database": "mydb",
    "sql": "SELECT * FROM users WHERE age > :minAge",
    "parameters": [{ "name": "minAge", "value": { "longValue": 30 } }],
    "includeResultMetadata": true
  }
}
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| resourceArn | string | Yes | ARN of the Aurora/RDS cluster |
| secretArn | string | Yes | ARN of the Secrets Manager secret with credentials |
| database | string | No | Database name |
| schema | string | No | Database schema |
| sql | string | Yes | SQL statement to execute |
| transactionId | string | No | Transaction ID (from `BeginTransaction`) |
| parameters | array of objects | No | SQL parameters (see parameter types below) |
| includeResultMetadata | boolean | No | Include column metadata in results |

**Parameter value types:**
```json
{ "name": "param1", "value": { "stringValue": "hello" } }
{ "name": "param2", "value": { "longValue": 42 } }
{ "name": "param3", "value": { "doubleValue": 3.14 } }
{ "name": "param4", "value": { "booleanValue": true } }
{ "name": "param5", "value": { "isNull": true } }
{ "name": "param6", "value": { "blobValue": "base64encoded..." } }
{ "name": "param7", "value": { "arrayValue": { "stringValues": ["a", "b"] } } }
```

#### BatchExecuteStatement
Execute a SQL statement with multiple parameter sets (batch insert/update).
```json
{
  "command": "BatchExecuteStatement",
  "params": {
    "resourceArn": "arn:aws:rds:...",
    "secretArn": "arn:aws:secretsmanager:...",
    "database": "mydb",
    "sql": "INSERT INTO users (name, age) VALUES (:name, :age)",
    "parameterSets": [
      [{ "name": "name", "value": { "stringValue": "Alice" } }, { "name": "age", "value": { "longValue": 30 } }],
      [{ "name": "name", "value": { "stringValue": "Bob" } }, { "name": "age", "value": { "longValue": 25 } }]
    ]
  }
}
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| resourceArn | string | Yes | ARN of the Aurora/RDS cluster |
| secretArn | string | Yes | ARN of the Secrets Manager secret |
| database | string | No | Database name |
| schema | string | No | Database schema |
| sql | string | Yes | SQL statement |
| transactionId | string | No | Transaction ID |
| parameters | array of objects | No | SQL parameters for the batch |

#### BeginTransaction
Start a new database transaction.
```json
{
  "command": "BeginTransaction",
  "params": {
    "resourceArn": "arn:aws:rds:...",
    "secretArn": "arn:aws:secretsmanager:...",
    "database": "mydb"
  }
}
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| resourceArn | string | Yes | ARN of the Aurora/RDS cluster |
| secretArn | string | Yes | ARN of the Secrets Manager secret |
| database | string | No | Database name |

Returns a `transactionId` to use with `ExecuteStatement` and `CommitTransaction`/`RollbackTransaction`.

#### CommitTransaction
Commit a transaction.
```json
{
  "command": "CommitTransaction",
  "params": {
    "resourceArn": "arn:aws:rds:...",
    "secretArn": "arn:aws:secretsmanager:...",
    "transactionId": "abc123"
  }
}
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| resourceArn | string | Yes | ARN of the Aurora/RDS cluster |
| secretArn | string | Yes | ARN of the Secrets Manager secret |
| transactionId | string | Yes | Transaction ID from `BeginTransaction` |

#### RollbackTransaction
Roll back a transaction.
```json
{
  "command": "RollbackTransaction",
  "params": {
    "resourceArn": "arn:aws:rds:...",
    "secretArn": "arn:aws:secretsmanager:...",
    "transactionId": "abc123"
  }
}
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| resourceArn | string | Yes | ARN of the Aurora/RDS cluster |
| secretArn | string | Yes | ARN of the Secrets Manager secret |
| transactionId | string | Yes | Transaction ID from `BeginTransaction` |

---

## Related Services

- **RDS Data → RDS**: Use `RDSTool` `DescribeDBClusters` to find cluster ARNs and check if Data API is enabled (see awsflow-rds skill)
- **RDS Data → Secrets Manager**: The `secretArn` parameter references a Secrets Manager secret containing database credentials
- **RDS Data → Lambda**: Lambda functions commonly use the Data API to access Aurora Serverless without managing connections
- **RDS Data → CloudWatch**: SQL query metrics and errors appear in CloudWatch
