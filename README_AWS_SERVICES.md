# AWS Language Model Tools Reference

This document provides a comprehensive reference of all AWS language model tools available in Awsflow.

## MCP Access

- Local-only MCP stdio sessions can be started via **Awsflow: Start MCP Server** (Command Palette). Up to 3 concurrent sessions are allowed; further requests queue until a session ends.
- MCP tool availability is controlled separately from the Service Access view via settings (`awsflow.mcp.disabledTools`).
- Mutating operations still require confirmation before execution.

## Available Tools

| Service | Command | Description | Sample Prompts |
|---------|---------|-------------|----------------|
| **Session** | GetSession | Get current AWS session details (profile, region, endpoint) | "What AWS profile am I using?", "Show current session" |
| **Session** | SetSession | Update AWS profile, region, or endpoint | "Switch to profile dev-account", "Change region to us-west-2" |
| **Session** | ListProfiles | List all available AWS profiles from local config | "Show all my AWS profiles", "List available profiles" |
| **Session** | RefreshCredentials | Refresh cached AWS credentials | "Refresh my credentials", "Update AWS credentials" |
| **Test AWS Connection** | TestAwsConnection | Test AWS connectivity using STS GetCallerIdentity | "Test my AWS connection", "Check if AWS credentials work" |
| **STS** | GetCallerIdentity | Get details about the IAM identity | "Who am I?", "Show my AWS identity" |
| **STS** | GetAccessKeyInfo | Get info about access key | "Get info for access key AKIA..." |
| **STS** | GetSessionToken | Get temporary session credentials | "Generate temporary credentials" |
| **STS** | GetFederationToken | Get federated user credentials | "Create federated token for user" |
| **S3** | ListBuckets | List all S3 buckets | "List my S3 buckets", "Show all buckets" |
| **S3** | ListObjectsV2 | List objects in a bucket with prefix filtering | "List objects in bucket my-bucket", "Show files in s3://my-bucket/logs/" |
| **S3** | HeadBucket | Check if bucket exists and you have access | "Check if bucket exists" |
| **S3** | HeadObject | Get object metadata without downloading | "Get metadata for s3://bucket/key" |
| **S3** | GetObject | Download and read S3 object content | "Read file from s3://bucket/file.txt", "Download s3://bucket/data.json" |
| **S3** | PutObject | Upload content to S3 | "Upload this content to s3://bucket/file.txt" |
| **S3** | DeleteObject | Delete an object from S3 | "Delete s3://bucket/old-file.txt" |
| **S3** | CopyObject | Copy object within S3 | "Copy s3://bucket/source to s3://bucket/dest" |
| **S3** | GetBucketPolicy | Get bucket policy document | "Show bucket policy for my-bucket" |
| **S3** | ListObjectVersions | List all versions of objects | "List versions in bucket my-bucket" |
| **S3** | OpenS3Explorer | Open interactive S3 browser view | "Browse my S3 bucket", "Open S3 explorer for bucket" |
| **S3 File Ops** | UploadFile | Upload one or multiple local files to S3 | "Upload file.txt to s3://bucket/", "Upload multiple files to S3" |
| **S3 File Ops** | DownloadFile | Download one or multiple S3 objects to local | "Download s3://bucket/file.txt", "Download multiple files from S3" |
| **S3 File Ops** | UploadFolder | Upload folder(s) with preserved structure to S3 | "Upload ./data folder to s3://bucket/", "Upload multiple folders to S3" |
| **S3 File Ops** | DownloadFolder | Download S3 folder(s) with preserved structure | "Download s3://bucket/logs/ folder", "Download multiple folders from S3" |
| **SQS** | ListQueues | List all SQS queues | "List my SQS queues", "Show all queues" |
| **SQS** | GetQueueUrl | Get URL for a queue by name | "Get URL for queue my-queue" |
| **SQS** | GetQueueAttributes | Get queue configuration and metrics | "Show attributes for queue my-queue" |
| **SQS** | SendMessage | Send a message to a queue | "Send message 'hello' to queue my-queue" |
| **SQS** | ReceiveMessage | Receive messages from queue | "Receive messages from queue my-queue", "Poll queue for messages" |
| **SQS** | DeleteMessage | Delete a message from queue | "Delete message with receipt handle XYZ" |
| **SQS** | ListDeadLetterSourceQueues | List queues using this queue as DLQ | "Show dead letter source queues for my-dlq" |
| **SQS** | ListQueueTags | List tags on a queue | "Show tags for queue my-queue" |
| **SNS** | ListTopics | List all SNS topics | "List my SNS topics", "Show all topics" |
| **SNS** | GetTopicAttributes | Get topic configuration | "Show attributes for topic my-topic" |
| **SNS** | Publish | Publish message to a topic | "Publish 'hello' to topic my-topic" |
| **SNS** | ListSubscriptions | List all subscriptions | "List my SNS subscriptions" |
| **SNS** | ListSubscriptionsByTopic | List subscriptions for a topic | "Show subscriptions for topic my-topic" |
| **SNS** | GetSubscriptionAttributes | Get subscription details | "Show subscription attributes for arn:..." |
| **SNS** | ListTagsForResource | List tags on SNS resource | "Show tags for topic arn:..." |
| **EC2** | DescribeInstances | List and describe EC2 instances | "List my EC2 instances", "Show running instances" |
| **EC2** | DescribeInstanceStatus | Get instance status checks | "Check status of instance i-123" |
| **EC2** | DescribeImages | List AMIs | "Show my AMIs", "List available images" |
| **EC2** | DescribeSecurityGroups | List security groups | "List security groups", "Show sg rules" |
| **EC2** | DescribeVpcs | List VPCs | "Show my VPCs" |
| **EC2** | DescribeSubnets | List subnets | "List subnets in VPC vpc-123" |
| **EC2** | DescribeVolumes | List EBS volumes | "Show all EBS volumes" |
| **EC2** | DescribeSnapshots | List EBS snapshots | "List my snapshots" |
| **EC2** | DescribeKeyPairs | List SSH key pairs | "Show my key pairs" |
| **EC2** | DescribeAddresses | List Elastic IPs | "Show elastic IPs" |
| **EC2** | DescribeRegions | List AWS regions | "List all AWS regions" |
| **EC2** | DescribeAvailabilityZones | List availability zones | "Show AZs in current region" |
| **EC2** | GetConsoleOutput | Get instance console output | "Show console output for instance i-123" |
| **Lambda** | ListFunctions | List Lambda functions | "List my Lambda functions", "Show all functions" |
| **Lambda** | GetFunction | Get function details and code location | "Show function details for my-function" |
| **Lambda** | GetFunctionConfiguration | Get function configuration | "Show config for function my-function" |
| **Lambda** | Invoke | Invoke a Lambda function | "Invoke function my-function with payload {}", "Call Lambda function" |
| **Lambda** | UpdateFunctionCode | Update function code | "Update function code from S3 bucket/key" |
| **Lambda** | ListTags | List function tags | "Show tags for function my-function" |
| **Lambda** | TagResource | Add tags to function | "Tag function my-function with env=prod" |
| **Lambda** | UntagResource | Remove tags from function | "Remove tag env from function my-function" |
| **Step Functions** | ListStateMachines | List state machines | "List my step functions", "Show state machines" |
| **Step Functions** | DescribeStateMachine | Get state machine details | "Describe state machine arn:..." |
| **Step Functions** | ListExecutions | List state machine executions | "Show executions for state machine arn:..." |
| **Step Functions** | DescribeExecution | Get execution details | "Show execution details for arn:..." |
| **Step Functions** | StartExecution | Start state machine execution | "Start execution of state machine with input {}" |
| **Step Functions** | UpdateStateMachine | Update state machine definition | "Update state machine definition" |
| **CloudWatch Logs** | DescribeLogGroups | List log groups | "List CloudWatch log groups", "Show log groups" |
| **CloudWatch Logs** | DescribeLogStreams | List log streams in a group | "List log streams in /aws/lambda/my-function" |
| **CloudWatch Logs** | GetLogEvents | Get log events from a stream | "Get logs from /aws/lambda/my-function", "Show recent logs" |
| **CloudWatch Logs** | OpenCloudWatchLogView | Open interactive log viewer | "Open log viewer for /aws/lambda/my-function" |
| **CloudFormation** | ListStacks | List CloudFormation stacks | "List my CloudFormation stacks", "Show all stacks" |
| **CloudFormation** | DescribeStacks | Get stack details | "Describe stack my-stack" |
| **CloudFormation** | DescribeStackResources | List stack resources | "Show resources in stack my-stack" |
| **CloudFormation** | DescribeStackEvents | Get stack events | "Show events for stack my-stack" |
| **CloudFormation** | GetTemplate | Get stack template | "Get template for stack my-stack" |
| **CloudFormation** | GetTemplateSummary | Get template summary | "Summarize template for stack my-stack" |
| **CloudFormation** | ListStackSets | List stack sets | "List CloudFormation stack sets" |
| **CloudFormation** | DescribeChangeSet | Get change set details | "Describe change set my-changeset" |
| **RDS** | DescribeDBInstances | List RDS database instances | "List my RDS instances", "Show databases" |
| **RDS** | DescribeDBClusters | List Aurora clusters | "List Aurora clusters" |
| **RDS** | DescribeDBSnapshots | List database snapshots | "Show RDS snapshots" |
| **RDS** | DescribeDBEngineVersions | List available DB engine versions | "Show available PostgreSQL versions" |
| **RDS** | DescribeDBLogFiles | List database log files | "List log files for database my-db" |
| **RDS** | DownloadDBLogFilePortion | Download portion of log file | "Download log file from database" |
| **RDS** | ListTagsForResource | List tags on RDS resource | "Show tags for database arn:..." |
| **RDS Data** | ExecuteStatement | Execute SQL via RDS Data API | "Run SELECT * FROM users on database my-db" |
| **RDS Data** | BatchExecuteStatement | Execute batch SQL statements | "Run batch SQL on database" |
| **RDS Data** | BeginTransaction | Start transaction | "Begin transaction on database" |
| **RDS Data** | CommitTransaction | Commit transaction | "Commit transaction" |
| **RDS Data** | RollbackTransaction | Rollback transaction | "Rollback transaction" |
| **DynamoDB** | ListTables | List DynamoDB tables | "List my DynamoDB tables", "Show all tables" |
| **DynamoDB** | DescribeTable | Get table details | "Describe table my-table" |
| **DynamoDB** | Query | Query items with conditions | "Query table my-table where id=123" |
| **DynamoDB** | Scan | Scan entire table | "Scan table my-table" |
| **DynamoDB** | GetItem | Get item by key | "Get item from table my-table with id=123" |
| **DynamoDB** | PutItem | Insert or update item | "Put item into table my-table" |
| **DynamoDB** | UpdateItem | Update specific item attributes | "Update item in table my-table" |
| **DynamoDB** | DeleteItem | Delete item by key | "Delete item from table my-table with id=123" |
| **DynamoDB** | CreateTable | Create new table | "Create DynamoDB table my-table" |
| **DynamoDB** | DeleteTable | Delete table | "Delete table my-table" |
| **DynamoDB** | UpdateTable | Update table configuration | "Update table my-table capacity" |
| **DynamoDB** | ListTagsOfResource | List tags on table | "Show tags for table arn:..." |
| **IAM** | ListRoles | List IAM roles | "List IAM roles", "Show all roles" |
| **IAM** | GetRole | Get role details | "Show details for role my-role" |
| **IAM** | ListRolePolicies | List inline policies for role | "List policies for role my-role" |
| **IAM** | GetRolePolicy | Get inline policy document | "Show policy my-policy for role my-role" |
| **IAM** | ListAttachedRolePolicies | List attached managed policies | "Show attached policies for role my-role" |
| **IAM** | ListPolicies | List IAM policies | "List IAM policies" |
| **IAM** | GetPolicy | Get policy details | "Show policy arn:..." |
| **IAM** | GetPolicyVersion | Get specific policy version | "Show version v1 of policy arn:..." |
| **Glue** | ListJobs | List Glue ETL jobs | "List my Glue jobs", "Show ETL jobs" |
| **Glue** | GetJob | Get job details | "Show details for Glue job my-job" |
| **Glue** | StartJobRun | Start job execution | "Start Glue job my-job" |
| **Glue** | GetJobRun | Get job run details | "Show run details for job my-job run-id" |
| **Glue** | GetJobRuns | List job runs | "List runs for Glue job my-job" |
| **Glue** | ListTriggers | List Glue triggers | "List Glue triggers" |
| **Glue** | GetTrigger | Get trigger details | "Show trigger my-trigger" |
| **Glue** | CreateJob | Create new Glue job | "Create Glue job with script s3://bucket/script.py" |
| **EMR** | DescribeCluster | Get details for an EMR cluster | "Describe EMR cluster j-ABC123" |
| **EMR** | DescribeJobFlows | Describe legacy job flows | "Describe job flows created last week" |
| **EMR** | DescribeNotebookExecution | Describe a notebook execution | "Describe notebook execution exe-123" |
| **EMR** | DescribePersistentAppUI | Show persistent application UI settings | "Describe persistent app UI for cluster j-ABC123" |
| **EMR** | DescribeReleaseLabel | Get details for an EMR release label | "Describe release label emr-6.15.0" |
| **EMR** | DescribeSecurityConfiguration | Show EMR security configuration | "Show security configuration my-sec-config" |
| **EMR** | DescribeStep | Describe a step on a cluster | "Describe step s-XYZ on cluster j-ABC123" |
| **EMR** | DescribeStudio | Get details for an EMR Studio | "Describe EMR Studio st-123456" |
| **EMR** | GetAutoTerminationPolicy | Get auto termination policy for a cluster | "Get auto termination policy for cluster j-ABC123" |
| **EMR** | GetBlockPublicAccessConfiguration | Show block public access configuration | "Show EMR block public access configuration" |
| **EMR** | GetClusterSessionCredentials | Get cluster session credentials | "Get session credentials for cluster j-ABC123" |
| **EMR** | GetManagedScalingPolicy | Show managed scaling policy | "Show managed scaling policy for cluster j-ABC123" |
| **EMR** | GetOnClusterAppUIPresignedURL | Get presigned URL for on-cluster app UI | "Get on-cluster app UI URL for cluster j-ABC123" |
| **EMR** | GetPersistentAppUIPresignedURL | Get presigned URL for persistent app UI | "Get persistent app UI URL for cluster j-ABC123" |
| **EMR** | GetStudioSessionMapping | Get studio session mapping for a user/group | "Get studio session mapping for user alice in studio st-123" |
| **EMR** | ListBootstrapActions | List bootstrap actions for a cluster | "List bootstrap actions for cluster j-ABC123" |
| **EMR** | ListClusters | List EMR clusters | "List EMR clusters created after 2024-01-01" |
| **EMR** | ListInstanceFleets | List instance fleets for a cluster | "List instance fleets for cluster j-ABC123" |
| **EMR** | ListInstanceGroups | List instance groups for a cluster | "List instance groups for cluster j-ABC123" |
| **EMR** | ListInstances | List cluster instances | "List core nodes in cluster j-ABC123" |
| **EMR** | ListNotebookExecutions | List notebook executions | "List EMR notebook executions" |
| **EMR** | ListReleaseLabels | List available EMR release labels | "List EMR release labels" |
| **EMR** | ListSecurityConfigurations | List EMR security configurations | "List security configurations" |
| **EMR** | ListSteps | List steps for a cluster | "List running steps on cluster j-ABC123" |
| **EMR** | ListStudios | List EMR Studios | "List EMR Studios" |
| **EMR** | ListStudioSessionMappings | List studio session mappings | "List session mappings for studio st-123" |
| **EMR** | ListSupportedInstanceTypes | List supported instance types for a release label | "List supported instance types for emr-6.15.0" |
| **API Gateway** | GetRestApis | List REST APIs | "List API Gateway APIs", "Show all REST APIs" |
| **API Gateway** | GetResources | List API resources | "Show resources for API abc123" |
| **API Gateway** | GetStages | List API stages | "Show stages for API abc123" |
| **API Gateway** | GetDeployments | List deployments | "List deployments for API abc123" |
| **API Gateway** | GetApiKeys | List API keys | "Show API keys" |
| **API Gateway** | GetAuthorizers | List authorizers | "Show authorizers for API abc123" |
| **File Operations** | ReadFile | Read file content from workspace | "Read file config.json", "Show contents of package.json" |
| **File Operations** | ReadFileAsBase64 | Read file as base64 | "Read image.png as base64" |
| **File Operations** | GetFileInfo | Get file metadata (size, dates) | "Show file info for data.csv" |
| **File Operations** | ListFiles | List files in directory | "List files in src/", "Show files recursively in project/" |
| **File Operations** | ZipTextFile | Create zip archive of file | "Zip file data.txt" |

## Pagination Support

All commands that return paginated results (with `NextContinuationToken`, `NextToken`, or `NextMarker`) automatically display a **Load More** button in the chat interface. Click the button to fetch additional results without re-typing the command.

## Notes

- Commands require appropriate IAM permissions for the AWS profile in use
- Use the status bar to switch profiles/regions before executing commands
- Some commands support additional optional parameters - ask the AI for help with specific parameter requirements
- All responses include metadata like request IDs and HTTP status codes for troubleshooting
