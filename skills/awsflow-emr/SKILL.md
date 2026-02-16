---
name: awsflow-emr
description: Manage and inspect AWS EMR clusters, steps, instances, studios, notebook executions, release labels, security configurations, and managed scaling using awsflow. Supports full lifecycle operations.
---

# Awsflow EMR

Manage and inspect EMR clusters, steps, studios, notebook executions, and related configurations.

## When to Use This Skill

Use this skill when the user:

- Asks about EMR clusters, Hadoop, or Spark
- Wants to inspect cluster status, steps, or instances
- Needs to view EMR studios or notebook executions
- Asks about release labels, instance types, or security configurations
- Wants to check auto-termination, managed scaling, or session credentials
- Wants to launch or terminate clusters
- Needs to add steps, instance groups, or tags
- Wants to modify cluster settings or scaling policies

## Tool: EMRTool

Describe and manage EMR clusters, steps, studios, and configurations. ALWAYS provide params object.

### Commands

#### ListClusters
List EMR clusters with optional state filter.
```json
{ "command": "ListClusters", "params": { "ClusterStates": ["RUNNING", "WAITING"] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ClusterStates | array of strings | No | Filter by states: `STARTING`, `BOOTSTRAPPING`, `RUNNING`, `WAITING`, `TERMINATING`, `TERMINATED`, `TERMINATED_WITH_ERRORS` |
| CreatedAfter | string | No | ISO date string filter |
| CreatedBefore | string | No | ISO date string filter |
| Marker | string | No | Pagination marker |

#### DescribeCluster
Get detailed information about a cluster.
```json
{ "command": "DescribeCluster", "params": { "ClusterId": "j-1234567890ABC" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ClusterId | string | Yes | EMR cluster ID |

#### ListSteps
List steps in a cluster.
```json
{ "command": "ListSteps", "params": { "ClusterId": "j-1234567890ABC", "StepStates": ["FAILED"] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ClusterId | string | Yes | EMR cluster ID |
| StepStates | array of strings | No | Filter by step states |
| Marker | string | No | Pagination marker |

#### DescribeStep
Get details of a specific step.
```json
{ "command": "DescribeStep", "params": { "ClusterId": "j-1234567890ABC", "StepId": "s-ABC123" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ClusterId | string | Yes | EMR cluster ID |
| StepId | string | Yes | Step ID |

#### ListInstances
List EC2 instances in a cluster.
```json
{ "command": "ListInstances", "params": { "ClusterId": "j-1234567890ABC", "InstanceStates": ["RUNNING"] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ClusterId | string | Yes | EMR cluster ID |
| InstanceFleetId | string | No | Instance fleet ID filter |
| InstanceGroupId | string | No | Instance group ID filter |
| InstanceStates | array of strings | No | Filter by states |

#### ListInstanceFleets
List instance fleets in a cluster.
```json
{ "command": "ListInstanceFleets", "params": { "ClusterId": "j-1234567890ABC" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ClusterId | string | Yes | EMR cluster ID |
| Marker | string | No | Pagination marker |

#### ListInstanceGroups
List instance groups in a cluster.
```json
{ "command": "ListInstanceGroups", "params": { "ClusterId": "j-1234567890ABC" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ClusterId | string | Yes | EMR cluster ID |
| Marker | string | No | Pagination marker |

#### ListBootstrapActions
List bootstrap actions for a cluster.
```json
{ "command": "ListBootstrapActions", "params": { "ClusterId": "j-1234567890ABC" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ClusterId | string | Yes | EMR cluster ID |
| Marker | string | No | Pagination marker |

#### ListStudios
List EMR studios.
```json
{ "command": "ListStudios", "params": {} }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Marker | string | No | Pagination marker |

#### DescribeStudio
Get details of an EMR studio.
```json
{ "command": "DescribeStudio", "params": { "StudioId": "es-ABC123" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| StudioId | string | Yes | Studio ID |

#### ListNotebookExecutions
List notebook executions.
```json
{ "command": "ListNotebookExecutions", "params": {} }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| CreatedAfter | string | No | ISO date filter |
| CreatedBefore | string | No | ISO date filter |
| NextToken | string | No | Pagination token |

#### DescribeNotebookExecution
Get details of a notebook execution.
```json
{ "command": "DescribeNotebookExecution", "params": { "NotebookExecutionId": "ex-ABC123" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| NotebookExecutionId | string | Yes | Notebook execution ID |

#### ListReleaseLabels
List available EMR release labels.
```json
{ "command": "ListReleaseLabels", "params": {} }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| NextToken | string | No | Pagination token |
| MaxResults | number | No | Maximum results |

#### DescribeReleaseLabel
Get details for a release label.
```json
{ "command": "DescribeReleaseLabel", "params": { "ReleaseLabel": "emr-7.0.0" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ReleaseLabel | string | Yes | Release label |

#### ListSupportedInstanceTypes
List instance types supported for a release.
```json
{ "command": "ListSupportedInstanceTypes", "params": { "ReleaseLabel": "emr-7.0.0" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ReleaseLabel | string | No | Release label |

#### DescribeSecurityConfiguration
Get a security configuration.
```json
{ "command": "DescribeSecurityConfiguration", "params": { "SecurityConfigurationName": "my-config" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| SecurityConfigurationName | string | Yes | Security configuration name |

### Lifecycle and Management Commands

#### RunJobFlow
Create a new EMR cluster.
```json
{ "command": "RunJobFlow", "params": { "Name": "analytics-cluster", "ReleaseLabel": "emr-7.0.0", "Instances": { "InstanceGroups": [{ "InstanceRole": "MASTER", "InstanceType": "m5.xlarge", "InstanceCount": 1 }] }, "ServiceRole": "EMR_DefaultRole", "JobFlowRole": "EMR_EC2_DefaultRole" } }
```

#### AddJobFlowSteps
Add steps to a cluster.
```json
{ "command": "AddJobFlowSteps", "params": { "JobFlowId": "j-1234567890ABC", "Steps": [{ "Name": "spark-step", "ActionOnFailure": "CONTINUE", "HadoopJarStep": { "Jar": "command-runner.jar", "Args": ["spark-submit", "--deploy-mode", "cluster", "s3://bucket/job.py"] } }] } }
```

#### ModifyCluster
Modify cluster settings.
```json
{ "command": "ModifyCluster", "params": { "ClusterId": "j-1234567890ABC", "StepConcurrencyLevel": 2 } }
```

#### PutAutoScalingPolicy
Configure auto scaling for an instance group.
```json
{ "command": "PutAutoScalingPolicy", "params": { "ClusterId": "j-1234567890ABC", "InstanceGroupId": "ig-ABC123", "AutoScalingPolicy": { "Constraints": { "MinCapacity": 2, "MaxCapacity": 10 }, "Rules": [] } } }
```

#### AddTags
Tag a cluster.
```json
{ "command": "AddTags", "params": { "ResourceId": "j-1234567890ABC", "Tags": { "env": "prod" } } }
```

#### RemoveTags
Remove tags from a cluster.
```json
{ "command": "RemoveTags", "params": { "ResourceId": "j-1234567890ABC", "TagKeys": ["env"] } }
```

#### TerminateJobFlows
Terminate one or more clusters.
```json
{ "command": "TerminateJobFlows", "params": { "JobFlowIds": ["j-1234567890ABC"] } }
```

#### ListSecurityConfigurations
List security configurations.
```json
{ "command": "ListSecurityConfigurations", "params": {} }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Marker | string | No | Pagination marker |

#### GetAutoTerminationPolicy
Get auto-termination policy for a cluster.
```json
{ "command": "GetAutoTerminationPolicy", "params": { "ClusterId": "j-1234567890ABC" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ClusterId | string | Yes | EMR cluster ID |

#### GetBlockPublicAccessConfiguration
Get block public access configuration.
```json
{ "command": "GetBlockPublicAccessConfiguration", "params": {} }
```

#### GetManagedScalingPolicy
Get managed scaling policy for a cluster.
```json
{ "command": "GetManagedScalingPolicy", "params": { "ClusterId": "j-1234567890ABC" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ClusterId | string | Yes | EMR cluster ID |

#### GetClusterSessionCredentials
Get session credentials for a cluster.
```json
{ "command": "GetClusterSessionCredentials", "params": { "ClusterId": "j-1234567890ABC", "CredentialType": "UsernamePassword" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ClusterId | string | Yes | EMR cluster ID |
| CredentialType | string | Yes | Credential type |
| ExecutionRoleArn | string | No | Execution role ARN |
| DurationSeconds | number | No | Lifetime in seconds |

#### GetStudioSessionMapping
Get studio session mapping.
```json
{ "command": "GetStudioSessionMapping", "params": { "StudioId": "es-ABC123", "IdentityType": "USER", "IdentityId": "user-123" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| StudioId | string | Yes | Studio ID |
| IdentityType | string | Yes | `USER` or `GROUP` |
| IdentityId | string | Yes | Identity ID |

#### ListStudioSessionMappings
List studio session mappings.
```json
{ "command": "ListStudioSessionMappings", "params": { "StudioId": "es-ABC123" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| StudioId | string | Yes | Studio ID |
| IdentityType | string | No | `USER` or `GROUP` |

#### DescribeJobFlows
Describe job flows (legacy).
```json
{ "command": "DescribeJobFlows", "params": { "JobFlowIds": ["j-ABC123"] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| JobFlowIds | array of strings | No | Job flow IDs |
| CreatedAfter | string | No | ISO date filter |
| CreatedBefore | string | No | ISO date filter |

#### DescribePersistentAppUI / GetOnClusterAppUIPresignedURL / GetPersistentAppUIPresignedURL
Application UI commands for Spark History Server, etc.
```json
{ "command": "GetOnClusterAppUIPresignedURL", "params": { "ClusterId": "j-ABC123", "ApplicationId": "app-123" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ClusterId | string | Yes | EMR cluster ID |
| ApplicationId | string | Yes | Application ID |

---

## Related Services

- **EMR → S3**: Clusters use S3 for input/output data (EMRFS), logs, and scripts. Use `S3Tool` to inspect data
- **EMR → EC2**: Clusters run on EC2 instances. Use `EC2Tool` to inspect the underlying instances
- **EMR → CloudWatch**: Cluster metrics and logs in CloudWatch. Use `CloudWatchLogTool` to read logs
- **EMR → IAM**: Clusters use EC2 instance profiles and service roles. Use `IAMTool` to inspect
- **EMR → Glue Data Catalog**: EMR can use Glue Data Catalog as Hive metastore. Use `GlueTool` to query the catalog
- **EMR → CloudFormation**: EMR clusters managed by CloudFormation stacks
