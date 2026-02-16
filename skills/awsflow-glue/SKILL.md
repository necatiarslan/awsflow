---
name: awsflow-glue
description: Manage AWS Glue ETL jobs, triggers, crawlers, databases, tables, workflows, and connections using awsflow. Create, update, and delete resources, inspect crawl history, and manage tags.
---

# Awsflow Glue

Manage Glue ETL jobs, triggers, crawlers, databases, tables, workflows, and connections.

## When to Use This Skill

Use this skill when the user:

- Asks about Glue ETL jobs, crawlers, or triggers
- Wants to inspect or query the Glue Data Catalog (databases, tables, partitions)
- Needs to start a Glue job run
- Wants to create a Glue job
- Asks about Glue connections or job bookmarks
- Needs to inspect crawl history
- Wants to create or delete databases, tables, crawlers, or workflows
- Needs to update jobs, crawlers, or triggers

## Tool: GlueTool

Execute AWS Glue commands including Data Catalog queries and lifecycle operations. ALWAYS provide params object.

### Commands

#### ListJobs
List Glue jobs.
```json
{ "command": "ListJobs", "params": { "MaxResults": 50 } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| MaxResults | number | No | Maximum items to return |
| nextToken | string | No | Pagination token |

#### GetJob
Get details of a Glue job.
```json
{ "command": "GetJob", "params": { "JobName": "my-etl-job" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| JobName | string | Yes | Job name |

#### GetJobRun
Get details of a specific job run.
```json
{ "command": "GetJobRun", "params": { "JobName": "my-etl-job", "RunId": "jr_abc123" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| JobName | string | Yes | Job name |
| RunId | string | Yes | Job run ID |

#### GetJobRuns
List all runs of a job.
```json
{ "command": "GetJobRuns", "params": { "JobName": "my-etl-job", "MaxResults": 20 } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| JobName | string | Yes | Job name |
| MaxResults | number | No | Maximum items to return |
| nextToken | string | No | Pagination token |

#### GetJobBookmark
Get the bookmark state for a job.
```json
{ "command": "GetJobBookmark", "params": { "JobName": "my-etl-job" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| JobName | string | Yes | Job name |

#### StartJobRun
Start a Glue job run.
```json
{ "command": "StartJobRun", "params": { "JobName": "my-etl-job", "Arguments": { "--input-path": "s3://my-bucket/input/" } } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| JobName | string | Yes | Job name |
| Arguments | object | No | Job run arguments (override defaults) |
| Timeout | number | No | Job timeout in minutes |
| MaxCapacity | number | No | Maximum DPU capacity |
| WorkerType | string | No | `Standard`, `G.1X`, `G.2X`, `G.025X` |
| NumberOfWorkers | number | No | Number of workers |
| SecurityConfiguration | string | No | Security configuration name |
| AllocatedCapacity | number | No | Allocated capacity |
| JobRunId | string | No | Job run ID |

#### CreateJob
Create a new Glue job.
```json
{
  "command": "CreateJob",
  "params": {
    "Name": "my-new-job",
    "Role": "arn:aws:iam::123456789012:role/GlueRole",
    "Command": { "Name": "glueetl", "ScriptLocation": "s3://my-bucket/scripts/etl.py" },
    "WorkerType": "G.1X",
    "NumberOfWorkers": 10
  }
}
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Name | string | Yes | Job name |
| Role | string | Yes | IAM role ARN |
| Command | object | Yes | Command config with `Name` (glueetl/pythonshell/gluestreaming) and `ScriptLocation` |
| Description | string | No | Job description |
| LogUri | string | No | S3 URI for job logs |
| DefaultArguments | object | No | Default job arguments |
| MaxRetries | number | No | Maximum retries |
| Timeout | number | No | Timeout in minutes |
| MaxCapacity | number | No | Max DPU capacity |
| WorkerType | string | No | `Standard`, `G.1X`, `G.2X`, `G.025X` |
| NumberOfWorkers | number | No | Number of workers |
| SecurityConfiguration | string | No | Security config name |
| Tags | object | No | Key-value tags |

#### ListTriggers
List Glue triggers.
```json
{ "command": "ListTriggers", "params": { "MaxResults": 50 } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| DependentJobName | string | No | Filter by dependent job name |
| MaxResults | number | No | Maximum items |
| nextToken | string | No | Pagination token |

#### GetTrigger
Get details of a trigger.
```json
{ "command": "GetTrigger", "params": { "Name": "my-trigger" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Name | string | Yes | Trigger name |

#### GetTriggers
List triggers with optional filter.
```json
{ "command": "GetTriggers", "params": { "DependencyJobName": "my-job" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| DependencyJobName | string | No | Filter by dependency job name |
| MaxResults | number | No | Maximum items |
| nextToken | string | No | Pagination token |

#### ListCrawlers
List Glue crawlers.
```json
{ "command": "ListCrawlers", "params": {} }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| MaxResults | number | No | Maximum items |
| nextToken | string | No | Pagination token |

#### GetCrawler
Get details of a crawler.
```json
{ "command": "GetCrawler", "params": { "CrawlerName": "my-crawler" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| CrawlerName | string | Yes | Crawler name |

#### GetCrawlers
List crawlers with details.
```json
{ "command": "GetCrawlers", "params": {} }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| MaxResults | number | No | Maximum items |
| nextToken | string | No | Pagination token |

#### ListCrawls
List crawl runs for a crawler.
```json
{ "command": "ListCrawls", "params": { "CrawlerName": "my-crawler" } }
```

### Lifecycle Commands

#### CreateDatabase
Create a new database.
```json
{ "command": "CreateDatabase", "params": { "DatabaseInput": { "Name": "analytics" } } }
```

#### CreateTable
Create a new table.
```json
{ "command": "CreateTable", "params": { "DatabaseName": "analytics", "TableInput": { "Name": "events", "StorageDescriptor": { "Columns": [] } } } }
```

#### CreateCrawler
Create a crawler.
```json
{ "command": "CreateCrawler", "params": { "Name": "events-crawler", "Role": "arn:aws:iam::123456789012:role/GlueRole", "Targets": { "S3Targets": [{ "Path": "s3://bucket/data/" }] } } }
```

#### StartCrawler
Start a crawler.
```json
{ "command": "StartCrawler", "params": { "Name": "events-crawler" } }
```

#### UpdateJob
Update an existing job.
```json
{ "command": "UpdateJob", "params": { "JobName": "my-etl-job", "JobUpdate": { "Description": "Updated job" } } }
```

#### UpdateCrawler
Update an existing crawler.
```json
{ "command": "UpdateCrawler", "params": { "Name": "events-crawler", "Targets": { "S3Targets": [{ "Path": "s3://bucket/new/" }] } } }
```

#### UpdateTrigger
Update a trigger.
```json
{ "command": "UpdateTrigger", "params": { "Name": "daily-trigger", "TriggerUpdate": { "Description": "Updated" } } }
```

#### DeleteJob
Delete a job.
```json
{ "command": "DeleteJob", "params": { "JobName": "old-job" } }
```

#### DeleteCrawler
Delete a crawler.
```json
{ "command": "DeleteCrawler", "params": { "Name": "events-crawler" } }
```

#### DeleteDatabase
Delete a database.
```json
{ "command": "DeleteDatabase", "params": { "Name": "analytics" } }
```

#### DeleteTable
Delete a table.
```json
{ "command": "DeleteTable", "params": { "DatabaseName": "analytics", "Name": "events" } }
```

#### TagResource
Tag a Glue resource.
```json
{ "command": "TagResource", "params": { "ResourceArn": "arn:aws:glue:...", "Tags": { "env": "prod" } } }
```

#### UntagResource
Remove tags from a Glue resource.
```json
{ "command": "UntagResource", "params": { "ResourceArn": "arn:aws:glue:...", "TagKeys": ["env"] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| CrawlerName | string | Yes | Crawler name |
| MaxResults | number | No | Maximum items |
| nextToken | string | No | Pagination token |

#### GetDatabase
Get a Glue Data Catalog database.
```json
{ "command": "GetDatabase", "params": { "DatabaseName": "my-database" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| DatabaseName | string | Yes | Database name |
| CatalogId | string | No | Catalog ID (AWS account ID) |

#### GetDatabases
List all databases in the Data Catalog.
```json
{ "command": "GetDatabases", "params": {} }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| CatalogId | string | No | Catalog ID |

#### GetTable
Get a table definition from the Data Catalog.
```json
{ "command": "GetTable", "params": { "DatabaseName": "my-database", "Name": "my-table" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| DatabaseName | string | Yes | Database name |
| TableName | string | Yes | Table name |
| CatalogId | string | No | Catalog ID |

#### GetTables
List tables in a database.
```json
{ "command": "GetTables", "params": { "DatabaseName": "my-database" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| DatabaseName | string | Yes | Database name |
| CatalogId | string | No | Catalog ID |

#### GetPartitions
List partitions for a table.
```json
{ "command": "GetPartitions", "params": { "DatabaseName": "my-database", "TableName": "my-table" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| DatabaseName | string | Yes | Database name |
| TableName | string | Yes | Table name |
| Expression | string | No | Partition filter expression |
| CatalogId | string | No | Catalog ID |
| Segment | object | No | Segment config for parallel scanning |

#### GetConnections
List or get Glue connections.
```json
{ "command": "GetConnections", "params": { "ConnectionName": "my-connection" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ConnectionName | string | No | Connection name |
| HidePassword | boolean | No | Hide connection password |
| CatalogId | string | No | Catalog ID |

#### GetTags
Get tags for a Glue resource.
```json
{ "command": "GetTags", "params": { "ResourceArn": "arn:aws:glue:..." } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ResourceArn | string | Yes | Resource ARN |

---

## Related Services

- **Glue → CloudWatch Logs**: Glue job output logs go to `/aws-glue/jobs/output` and error logs to `/aws-glue/jobs/error`. Crawler logs go to `/aws-glue/crawlers`. Use `CloudWatchLogTool` to read them
- **Glue → S3**: Glue jobs read from and write to S3. Crawler targets are often S3 paths. Job scripts are stored in S3. Use `S3Tool` to inspect
- **Glue → IAM**: Jobs require IAM roles. Use `IAMTool` to inspect the execution role
- **Glue → Data Catalog → Athena/EMR/Redshift**: The Glue Data Catalog is shared with Athena, EMR, and Redshift Spectrum
- **Glue → CloudFormation**: Glue resources managed by CloudFormation stacks
- **Glue → DynamoDB**: Glue can read from DynamoDB tables as data sources
