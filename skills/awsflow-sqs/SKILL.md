---
name: awsflow-sqs
description: Manage Amazon SQS queues and messages using awsflow. List queues, send/receive/delete messages, manage visibility, purge queues, inspect dead letter queues, and get queue attributes and tags.
---

# Awsflow SQS

Manage SQS queues and send/receive messages.

## When to Use This Skill

Use this skill when the user:

- Asks about SQS queues or messaging
- Wants to send, receive, or delete messages
- Needs to inspect queue attributes or dead letter queues
- Wants to purge a queue
- Asks about FIFO queues, message groups, or deduplication
- Needs to manage message visibility

## Tool: SQSTool

Execute AWS SQS commands. ALWAYS provide params object.

### Commands

#### ListQueues
List SQS queues.
```json
{ "command": "ListQueues", "params": { "QueueNamePrefix": "prod-" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| QueueNamePrefix | string | No | Queue name prefix filter |
| MaxResults | number | No | Maximum results |
| NextToken | string | No | Pagination token |

#### GetQueueUrl
Get the URL for a queue by name.
```json
{ "command": "GetQueueUrl", "params": { "QueueName": "my-queue" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| QueueName | string | Yes | Queue name |
| QueueOwnerAWSAccountId | string | No | Queue owner account ID (for cross-account) |

#### GetQueueAttributes
Get queue attributes (message count, delay, visibility timeout, policy, etc.).
```json
{ "command": "GetQueueAttributes", "params": { "QueueUrl": "https://sqs.us-east-1.amazonaws.com/123456789012/my-queue", "AttributeNames": ["All"] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| QueueUrl | string | Yes | Queue URL |
| AttributeNames | array of strings | No | Attribute names to retrieve. Use `["All"]` for all attributes |

#### SendMessage
Send a message to a queue.
```json
{ "command": "SendMessage", "params": { "QueueUrl": "https://sqs...", "MessageBody": "Hello World" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| QueueUrl | string | Yes | Queue URL |
| MessageBody | string | Yes | Message body text |
| DelaySeconds | number | No | Delay before message becomes available |
| MessageAttributes | object | No | Custom message attributes |
| MessageDeduplicationId | string | No | Deduplication ID (FIFO queues) |
| MessageGroupId | string | No | Message group ID (FIFO queues) |

#### SendMessageBatch
Send multiple messages in a batch.
```json
{ "command": "SendMessageBatch", "params": { "QueueUrl": "https://sqs...", "Entries": [{"Id":"1","MessageBody":"msg1"},{"Id":"2","MessageBody":"msg2"}] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| QueueUrl | string | Yes | Queue URL |
| Entries | array of objects | Yes | Batch entries (up to 10) |

#### ReceiveMessage
Receive messages from a queue.
```json
{ "command": "ReceiveMessage", "params": { "QueueUrl": "https://sqs...", "MaxNumberOfMessages": 10, "WaitTimeSeconds": 5 } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| QueueUrl | string | Yes | Queue URL |
| MaxNumberOfMessages | number | No | Maximum messages to receive (1-10) |
| VisibilityTimeout | number | No | Visibility timeout in seconds |
| WaitTimeSeconds | number | No | Long polling wait time in seconds |
| AttributeNames | array of strings | No | System attribute names to retrieve |
| MessageAttributeNames | array of strings | No | Custom message attribute names |

#### DeleteMessage
Delete a message from a queue.
```json
{ "command": "DeleteMessage", "params": { "QueueUrl": "https://sqs...", "ReceiptHandle": "AQEBw..." } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| QueueUrl | string | Yes | Queue URL |
| ReceiptHandle | string | Yes | Receipt handle from `ReceiveMessage` |

#### DeleteMessageBatch
Delete multiple messages in a batch.
```json
{ "command": "DeleteMessageBatch", "params": { "QueueUrl": "https://sqs...", "Entries": [{"Id":"1","ReceiptHandle":"AQEBw..."}] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| QueueUrl | string | Yes | Queue URL |
| Entries | array of objects | Yes | Batch entries with `Id` and `ReceiptHandle` |

#### ChangeMessageVisibility
Change visibility timeout of a received message.
```json
{ "command": "ChangeMessageVisibility", "params": { "QueueUrl": "https://sqs...", "ReceiptHandle": "AQEBw...", "VisibilityTimeout": 60 } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| QueueUrl | string | Yes | Queue URL |
| ReceiptHandle | string | Yes | Receipt handle |
| VisibilityTimeout | number | Yes | New visibility timeout in seconds |

#### ChangeMessageVisibilityBatch
Change visibility for multiple messages.
```json
{ "command": "ChangeMessageVisibilityBatch", "params": { "QueueUrl": "https://sqs...", "Entries": [{"Id":"1","ReceiptHandle":"AQEBw...","VisibilityTimeout":60}] } }
```

#### PurgeQueue
Delete all messages in a queue.
```json
{ "command": "PurgeQueue", "params": { "QueueUrl": "https://sqs..." } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| QueueUrl | string | Yes | Queue URL |

#### ListDeadLetterSourceQueues
List queues that have this queue as their dead letter queue.
```json
{ "command": "ListDeadLetterSourceQueues", "params": { "QueueUrl": "https://sqs..." } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| QueueUrl | string | Yes | Dead letter queue URL |
| MaxResults | number | No | Maximum results |
| NextToken | string | No | Pagination token |

#### ListQueueTags
List tags for a queue.
```json
{ "command": "ListQueueTags", "params": { "QueueUrl": "https://sqs..." } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| QueueUrl | string | Yes | Queue URL |

---

## Related Services

- **SQS → Lambda**: SQS queues commonly trigger Lambda functions. Use `LambdaTool` `ListEventSourceMappings` to find Lambda consumers
- **SQS → SNS**: SNS topics can fan out to SQS queues. Use `SNSTool` `ListSubscriptionsByTopic` to find SQS subscriptions
- **SQS → Dead Letter Queues**: Failed messages go to DLQ. Use `GetQueueAttributes` to find the `RedrivePolicy` which contains the DLQ ARN, then `ListDeadLetterSourceQueues` to find source queues
- **SQS → CloudWatch**: SQS metrics (messages sent, received, deleted, approximate count) are in CloudWatch Metrics
- **SQS → S3**: S3 event notifications can deliver to SQS. Use `S3Tool` `GetBucketNotificationConfiguration`
- **SQS → Step Functions**: Step Functions can send messages to SQS as task states
