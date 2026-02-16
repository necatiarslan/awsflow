---
name: awsflow-sns
description: Manage Amazon SNS topics, subscriptions, publishing, platform applications, SMS, and endpoints using awsflow. Create, configure, and delete resources, publish messages, and check SMS/sandbox status.
---

# Awsflow SNS

Manage SNS topics, subscriptions, publishing, platform applications, and SMS.

## When to Use This Skill

Use this skill when the user:

- Asks about SNS topics or notifications
- Wants to publish messages to a topic
- Needs to inspect subscriptions or endpoints
- Asks about SMS, platform applications, or push notifications
- Wants to check data protection policies or sandbox status
- Wants to create or delete topics, subscriptions, or endpoints
- Needs to configure topic or subscription attributes

## Tool: SNSTool

Execute AWS SNS commands. ALWAYS provide params object.

### Commands

#### ListTopics
List all SNS topics.
```json
{ "command": "ListTopics", "params": {} }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| NextToken | string | No | Pagination token |

#### GetTopicAttributes
Get attributes of a topic (policy, subscriptions count, etc.).
```json
{ "command": "GetTopicAttributes", "params": { "TopicArn": "arn:aws:sns:us-east-1:123456789012:my-topic" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| TopicArn | string | Yes | Topic ARN |

#### Publish
Publish a message to a topic.
```json
{ "command": "Publish", "params": { "TopicArn": "arn:aws:sns:...", "Message": "Hello World", "Subject": "Test" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| TopicArn | string | Yes | Topic ARN |
| Message | string | Yes | Message body |
| Subject | string | No | Message subject (for email subscriptions) |
| TargetArn | string | No | Target ARN (for direct publishing) |
| phoneNumber | string | No | E.164 phone number (for SMS) |
| MessageStructure | string | No | Message structure (set to `json` for per-protocol messages) |
| MessageAttributes | object | No | Custom message attributes |

#### ListSubscriptions
List all subscriptions across topics.
```json
{ "command": "ListSubscriptions", "params": {} }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| NextToken | string | No | Pagination token |

#### ListSubscriptionsByTopic
List subscriptions for a specific topic.
```json
{ "command": "ListSubscriptionsByTopic", "params": { "TopicArn": "arn:aws:sns:..." } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| TopicArn | string | Yes | Topic ARN |
| NextToken | string | No | Pagination token |

#### GetSubscriptionAttributes
Get attributes of a subscription.
```json
{ "command": "GetSubscriptionAttributes", "params": { "SubscriptionArn": "arn:aws:sns:..." } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| SubscriptionArn | string | Yes | Subscription ARN |

#### ListTagsForResource
List tags for an SNS resource.
```json
{ "command": "ListTagsForResource", "params": { "ResourceArn": "arn:aws:sns:..." } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ResourceArn | string | Yes | Resource ARN |

#### ListPlatformApplications
List push notification platform applications.
```json
{ "command": "ListPlatformApplications", "params": {} }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| NextToken | string | No | Pagination token |

#### GetPlatformApplicationAttributes
Get attributes of a platform application.
```json
{ "command": "GetPlatformApplicationAttributes", "params": { "PlatformApplicationArn": "arn:aws:sns:..." } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| PlatformApplicationArn | string | Yes | Platform application ARN |

#### ListEndpointsByPlatformApplication
List endpoints for a platform application.
```json
{ "command": "ListEndpointsByPlatformApplication", "params": { "PlatformApplicationArn": "arn:aws:sns:..." } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| PlatformApplicationArn | string | Yes | Platform application ARN |

#### GetEndpointAttributes
Get attributes of an endpoint.
```json
{ "command": "GetEndpointAttributes", "params": { "EndpointArn": "arn:aws:sns:..." } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| EndpointArn | string | Yes | Endpoint ARN |

#### GetSMSAttributes
Get SMS sending attributes.
```json
{ "command": "GetSMSAttributes", "params": { "attributes": ["DefaultSMSType", "MonthlySpendLimit"] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| attributes | array of strings | No | Specific SMS attribute names to retrieve |

#### GetSMSSandboxAccountStatus
Check if the account is in SMS sandbox.
```json
{ "command": "GetSMSSandboxAccountStatus", "params": {} }
```
**Parameters:** None required.

#### GetDataProtectionPolicy
Get data protection policy for a topic.
```json
{ "command": "GetDataProtectionPolicy", "params": { "ResourceArn": "arn:aws:sns:..." } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ResourceArn | string | Yes | Resource ARN |

#### CheckIfPhoneNumberIsOptedOut
Check if a phone number has opted out.
```json
{ "command": "CheckIfPhoneNumberIsOptedOut", "params": { "phoneNumber": "+12345678901" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| phoneNumber | string | Yes | E.164 phone number |

#### ListPhoneNumbersOptedOut
List phone numbers that have opted out.
```json
{ "command": "ListPhoneNumbersOptedOut", "params": {} }
```

#### ListOriginationNumbers
List origination phone numbers.
```json
{ "command": "ListOriginationNumbers", "params": {} }
```

### Lifecycle Commands

#### CreateTopic
Create a new topic.
```json
{ "command": "CreateTopic", "params": { "Name": "alerts" } }
```

#### Subscribe
Subscribe an endpoint to a topic.
```json
{ "command": "Subscribe", "params": { "TopicArn": "arn:aws:sns:...:alerts", "Protocol": "email", "Endpoint": "team@example.com" } }
```

#### ConfirmSubscription
Confirm a subscription (for token-based subscriptions).
```json
{ "command": "ConfirmSubscription", "params": { "TopicArn": "arn:aws:sns:...:alerts", "Token": "token" } }
```

#### Unsubscribe
Unsubscribe an endpoint.
```json
{ "command": "Unsubscribe", "params": { "SubscriptionArn": "arn:aws:sns:..." } }
```

#### SetTopicAttributes
Update topic attributes.
```json
{ "command": "SetTopicAttributes", "params": { "TopicArn": "arn:aws:sns:...:alerts", "AttributeName": "DisplayName", "AttributeValue": "Alerts" } }
```

#### SetSubscriptionAttributes
Update subscription attributes.
```json
{ "command": "SetSubscriptionAttributes", "params": { "SubscriptionArn": "arn:aws:sns:...", "AttributeName": "RawMessageDelivery", "AttributeValue": "true" } }
```

#### CreatePlatformApplication
Create a platform application.
```json
{ "command": "CreatePlatformApplication", "params": { "Name": "mobile-app", "Platform": "APNS", "Attributes": { "PlatformCredential": "..." } } }
```

#### CreatePlatformEndpoint
Create a platform endpoint.
```json
{ "command": "CreatePlatformEndpoint", "params": { "PlatformApplicationArn": "arn:aws:sns:...", "Token": "device-token" } }
```

#### DeleteTopic
Delete a topic.
```json
{ "command": "DeleteTopic", "params": { "TopicArn": "arn:aws:sns:...:alerts" } }
```

#### DeletePlatformApplication
Delete a platform application.
```json
{ "command": "DeletePlatformApplication", "params": { "PlatformApplicationArn": "arn:aws:sns:..." } }
```

#### DeleteEndpoint
Delete a platform endpoint.
```json
{ "command": "DeleteEndpoint", "params": { "EndpointArn": "arn:aws:sns:..." } }
```

#### TagResource
Tag an SNS resource.
```json
{ "command": "TagResource", "params": { "ResourceArn": "arn:aws:sns:...", "Tags": [{ "Key": "env", "Value": "prod" }] } }
```

#### UntagResource
Remove tags from an SNS resource.
```json
{ "command": "UntagResource", "params": { "ResourceArn": "arn:aws:sns:...", "TagKeys": ["env"] } }
```

---

## Related Services

- **SNS → SQS**: SNS topics commonly subscribe to SQS queues for fan-out. Use `ListSubscriptionsByTopic` to find SQS subscriptions, then `SQSTool` to inspect queues
- **SNS → Lambda**: SNS can trigger Lambda functions. Use `ListSubscriptionsByTopic` to find Lambda subscriptions
- **SNS → S3**: S3 event notifications can publish to SNS. Use `S3Tool` `GetBucketNotificationConfiguration` to find the topic
- **SNS → CloudWatch**: SNS delivery metrics are in CloudWatch Metrics
- **SNS → CloudFormation**: SNS resources managed by CloudFormation stacks
