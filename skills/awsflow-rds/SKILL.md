---
name: awsflow-rds
description: Manage and inspect Amazon RDS instances, clusters, snapshots, parameter groups, logs, proxies, events, engine versions, subnet groups, security groups, certificates, recommendations, and more using awsflow.
---

# Awsflow RDS

Manage and inspect Amazon RDS instances, clusters, snapshots, parameter groups, logs, and configurations.

## When to Use This Skill

Use this skill when the user:

- Asks about RDS database instances or Aurora clusters
- Wants to inspect snapshots, backups, or replication
- Needs to view database logs or events
- Asks about parameter groups, subnet groups, or security groups
- Wants to check engine versions, instance options, or recommendations
- Needs to inspect RDS proxies or Blue/Green deployments
- Wants to create, modify, start, stop, or delete DB instances or clusters
- Needs to create snapshots or restore from snapshots

## Tool: RDSTool

Execute AWS RDS commands including lifecycle operations. ALWAYS provide params object.

### Commands

#### DescribeDBInstances
Describe RDS database instances.
```json
{ "command": "DescribeDBInstances", "params": { "DBInstanceIdentifier": "my-db" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| DBInstanceIdentifier | string | No | DB instance identifier |
| Filters | array of objects | No | Filters with `Name` and `Values[]` |
| Marker | string | No | Pagination marker |
| MaxRecords | number | No | Maximum records to return |

#### DescribeDBClusters
Describe Aurora DB clusters.
```json
{ "command": "DescribeDBClusters", "params": { "DBClusterIdentifier": "my-cluster" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| DBClusterIdentifier | string | No | DB cluster identifier |
| Filters | array of objects | No | Filter array |
| Marker | string | No | Pagination marker |
| MaxRecords | number | No | Maximum records |

#### DescribeDBSnapshots
Describe DB instance snapshots.
```json
{ "command": "DescribeDBSnapshots", "params": { "DBInstanceIdentifier": "my-db" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| DBInstanceIdentifier | string | No | Instance identifier |
| Filters | array of objects | No | Filter array |
| Marker | string | No | Pagination marker |
| MaxRecords | number | No | Maximum records |

#### DescribeDBClusterSnapshots
Describe Aurora cluster snapshots.
```json
{ "command": "DescribeDBClusterSnapshots", "params": { "DBClusterIdentifier": "my-cluster" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| DBClusterIdentifier | string | No | Cluster identifier |
| Filters | array of objects | No | Filter array |
| Marker | string | No | Pagination marker |
| MaxRecords | number | No | Maximum records |

#### DescribeDBEngineVersions
Describe available database engine versions.
```json
{ "command": "DescribeDBEngineVersions", "params": { "Engine": "mysql", "EngineVersion": "8.0" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Engine | string | No | Database engine (mysql, postgres, aurora-mysql, etc.) |
| EngineVersion | string | No | Engine version |
| Marker | string | No | Pagination marker |
| MaxRecords | number | No | Maximum records |

#### DescribeDBLogFiles
List log files for a DB instance.
```json
{ "command": "DescribeDBLogFiles", "params": { "DBInstanceIdentifier": "my-db" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| DBInstanceIdentifier | string | Yes | DB instance identifier |
| Marker | string | No | Pagination marker |
| MaxRecords | number | No | Maximum records |

#### DownloadDBLogFilePortion
Download a portion of a database log file.
```json
{ "command": "DownloadDBLogFilePortion", "params": { "DBInstanceIdentifier": "my-db", "LogFileName": "error/mysql-error.log" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| DBInstanceIdentifier | string | Yes | DB instance identifier |
| LogFileName | string | Yes | Log file name (from `DescribeDBLogFiles`) |

#### DescribeDBParameterGroups
List DB parameter groups.
```json
{ "command": "DescribeDBParameterGroups", "params": { "DBParameterGroupName": "my-param-group" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| DBParameterGroupName | string | No | Parameter group name |
| Marker | string | No | Pagination marker |
| MaxRecords | number | No | Maximum records |

#### DescribeDBClusterParameterGroups
List Aurora cluster parameter groups.
```json
{ "command": "DescribeDBClusterParameterGroups", "params": {} }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Marker | string | No | Pagination marker |
| MaxRecords | number | No | Maximum records |

#### DescribeDBSubnetGroups
List DB subnet groups.
```json
{ "command": "DescribeDBSubnetGroups", "params": {} }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Marker | string | No | Pagination marker |
| MaxRecords | number | No | Maximum records |

#### DescribeDBSecurityGroups
List DB security groups (EC2-Classic).
```json
{ "command": "DescribeDBSecurityGroups", "params": {} }
```

#### DescribeDBProxies
List RDS Proxy instances.
```json
{ "command": "DescribeDBProxies", "params": {} }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Filters | array of objects | No | Filter array |
| Marker | string | No | Pagination marker |
| MaxRecords | number | No | Maximum records |

#### DescribeDBProxyEndpoints
List RDS Proxy endpoints.
```json
{ "command": "DescribeDBProxyEndpoints", "params": {} }
```

#### DescribeDBSnapshotAttributes
Get shared permissions for a snapshot.
```json
{ "command": "DescribeDBSnapshotAttributes", "params": {} }
```

#### DescribeDBInstanceAutomatedBackups
List automated backups for DB instances.
```json
{ "command": "DescribeDBInstanceAutomatedBackups", "params": {} }
```

#### DescribeDBClusterAutomatedBackups
List automated backups for Aurora clusters.
```json
{ "command": "DescribeDBClusterAutomatedBackups", "params": { "DBClusterIdentifier": "my-cluster" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| DBClusterIdentifier | string | No | Cluster identifier |

#### DescribeDBRecommendations
List RDS recommendations.
```json
{ "command": "DescribeDBRecommendations", "params": {} }
```

### Lifecycle Commands

#### CreateDBInstance
Create a DB instance.
```json
{ "command": "CreateDBInstance", "params": { "DBInstanceIdentifier": "my-db", "DBInstanceClass": "db.t3.micro", "Engine": "mysql", "MasterUsername": "admin", "MasterUserPassword": "Secret1234!" } }
```

#### ModifyDBInstance
Modify a DB instance.
```json
{ "command": "ModifyDBInstance", "params": { "DBInstanceIdentifier": "my-db", "AllocatedStorage": 50 } }
```

#### StartDBInstance
Start a stopped DB instance.
```json
{ "command": "StartDBInstance", "params": { "DBInstanceIdentifier": "my-db" } }
```

#### StopDBInstance
Stop a DB instance.
```json
{ "command": "StopDBInstance", "params": { "DBInstanceIdentifier": "my-db" } }
```

#### DeleteDBInstance
Delete a DB instance.
```json
{ "command": "DeleteDBInstance", "params": { "DBInstanceIdentifier": "my-db", "SkipFinalSnapshot": true } }
```

#### CreateDBSnapshot
Create a DB snapshot.
```json
{ "command": "CreateDBSnapshot", "params": { "DBInstanceIdentifier": "my-db", "DBSnapshotIdentifier": "my-db-snap" } }
```

#### RestoreDBInstanceFromDBSnapshot
Restore a DB instance from snapshot.
```json
{ "command": "RestoreDBInstanceFromDBSnapshot", "params": { "DBInstanceIdentifier": "my-db-restore", "DBSnapshotIdentifier": "my-db-snap" } }
```

#### AddTagsToResource
Tag an RDS resource.
```json
{ "command": "AddTagsToResource", "params": { "ResourceName": "arn:aws:rds:...", "Tags": [{ "Key": "env", "Value": "prod" }] } }
```

#### RemoveTagsFromResource
Remove tags from a resource.
```json
{ "command": "RemoveTagsFromResource", "params": { "ResourceName": "arn:aws:rds:...", "TagKeys": ["env"] } }
```

#### DescribeBlueGreenDeployments
List Blue/Green deployment resources.
```json
{ "command": "DescribeBlueGreenDeployments", "params": {} }
```

#### DescribeEvents
List RDS events.
```json
{ "command": "DescribeEvents", "params": { "StartTime": "2024-01-01T00:00:00Z", "Duration": 1440 } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| StartTime | string | No | Start time |
| EndTime | string | No | End time |
| Duration | number | No | Duration in minutes |
| Marker | string | No | Pagination marker |
| MaxRecords | number | No | Maximum records |

#### DescribeEventSubscriptions
List RDS event subscriptions.
```json
{ "command": "DescribeEventSubscriptions", "params": {} }
```

#### DescribeOrderableDBInstanceOptions
List available DB instance options.
```json
{ "command": "DescribeOrderableDBInstanceOptions", "params": { "Engine": "mysql" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Engine | string | No | Database engine |
| EngineVersion | string | No | Engine version |

#### DescribeAccountAttributes
Get RDS account attributes and quotas.
```json
{ "command": "DescribeAccountAttributes", "params": {} }
```

#### DescribeCertificates
List RDS certificates.
```json
{ "command": "DescribeCertificates", "params": {} }
```

#### DescribeEngineDefaultParameters
Get default engine parameter settings.
```json
{ "command": "DescribeEngineDefaultParameters", "params": {} }
```

#### DescribeExportTasks
List snapshot export tasks.
```json
{ "command": "DescribeExportTasks", "params": {} }
```

#### DescribeGlobalClusters
List Aurora global database clusters.
```json
{ "command": "DescribeGlobalClusters", "params": {} }
```

#### DescribeIntegrations
List zero-ETL integrations.
```json
{ "command": "DescribeIntegrations", "params": {} }
```

#### DescribeOptionGroups
List option groups.
```json
{ "command": "DescribeOptionGroups", "params": {} }
```

#### DescribePendingMaintenanceActions
List pending maintenance actions.
```json
{ "command": "DescribePendingMaintenanceActions", "params": {} }
```

#### DescribeReservedDBInstances
List reserved DB instances.
```json
{ "command": "DescribeReservedDBInstances", "params": {} }
```

#### DescribeReservedDBInstancesOfferings
List reserved DB instance offerings.
```json
{ "command": "DescribeReservedDBInstancesOfferings", "params": {} }
```

#### DescribeSourceRegions
List source regions for cross-region features.
```json
{ "command": "DescribeSourceRegions", "params": {} }
```

#### DescribeTenantDatabases
List tenant databases.
```json
{ "command": "DescribeTenantDatabases", "params": {} }
```

#### DescribeValidDBInstanceModifications
Get valid modifications for a DB instance.
```json
{ "command": "DescribeValidDBInstanceModifications", "params": { "DBInstanceIdentifier": "my-db" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| DBInstanceIdentifier | string | Yes | DB instance identifier |

#### DescribeResourceScan / DescribeStackRefactor etc.
Additional describe commands follow the same pattern with appropriate filters and pagination.

#### ListTagsForResource
List tags for an RDS resource.
```json
{ "command": "ListTagsForResource", "params": { "ResourceName": "arn:aws:rds:us-east-1:123456789012:db:my-db" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ResourceName | string | Yes | Resource ARN |

---

## Related Services

- **RDS → CloudWatch Logs**: Database logs (error, slow query, audit) are published to CloudWatch. Log groups: `/aws/rds/instance/{instanceId}/{logType}` or `/aws/rds/cluster/{clusterId}/{logType}`. Use `CloudWatchLogTool` to read them
- **RDS → RDS Data API**: For Aurora Serverless clusters with Data API enabled, use `RDSDataTool` to execute SQL directly (see awsflow-rdsdata skill)
- **RDS → EC2**: RDS uses VPCs, subnets, and security groups. Use `EC2Tool` to inspect networking
- **RDS → IAM**: IAM authentication can be enabled for RDS. Use `IAMTool` to manage access
- **RDS → CloudFormation**: RDS resources managed by CloudFormation stacks
- **RDS → S3**: Snapshot exports go to S3. Use `DescribeExportTasks` to find them
