---
name: awsflow-s3
description: Manage Amazon S3 buckets and objects using awsflow. Create, configure, and delete buckets, upload/download objects, inspect bucket configuration (encryption, versioning, lifecycle, replication, logging, CORS, website), query object content with S3 Select, and open the S3 Explorer view.
---

# Awsflow S3

Manage Amazon S3 buckets and objects through the awsflow S3Tool.

## When to Use This Skill

Use this skill when the user:

- Asks about S3 buckets or objects
- Wants to list, upload, download, copy, or delete S3 objects
- Needs to inspect bucket configuration (encryption, versioning, lifecycle, etc.)
- Wants to query CSV/JSON/Parquet files with S3 Select SQL
- Wants to open the interactive S3 Explorer view
- Needs to check bucket policies, notifications, or replication settings
- Wants to create or delete buckets or update bucket settings

## Tool: S3Tool

Execute S3 commands including bucket configuration. ALWAYS provide params object.

### Commands

#### ListBuckets
List all S3 buckets in the account.
```json
{ "command": "ListBuckets", "params": {} }
```
**Parameters:** None required.

#### ListObjectsV2
List objects in a bucket with optional prefix/delimiter filtering.
```json
{ "command": "ListObjectsV2", "params": { "Bucket": "my-bucket", "Prefix": "data/", "Delimiter": "/", "MaxKeys": 100 } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |
| Prefix | string | No | Filter objects by prefix path |
| Delimiter | string | No | Delimiter character for grouping keys, typically `/` |
| MaxKeys | number | No | Maximum number of keys to return |
| ContinuationToken | string | No | Token for pagination from previous response |
| StartAfter | string | No | Start listing after this key name |

#### ListObjectVersions
List object versions in a versioning-enabled bucket.
```json
{ "command": "ListObjectVersions", "params": { "Bucket": "my-bucket", "Prefix": "data/" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |
| Prefix | string | No | Filter objects by prefix |
| Delimiter | string | No | Delimiter for grouping |
| MaxKeys | number | No | Maximum versions to return |
| KeyMarker | string | No | Key marker for version pagination |
| VersionIdMarker | string | No | Version ID marker for pagination |

#### HeadBucket
Check if a bucket exists and you have access.
```json
{ "command": "HeadBucket", "params": { "Bucket": "my-bucket" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |

#### HeadObject
Get metadata for an object without downloading it.
```json
{ "command": "HeadObject", "params": { "Bucket": "my-bucket", "Key": "file.txt" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |
| Key | string | Yes | Object key path |
| VersionId | string | No | Specific version ID |

#### GetObject
Download or read an object's content.
```json
{ "command": "GetObject", "params": { "Bucket": "my-bucket", "Key": "data.json", "AsText": true } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |
| Key | string | Yes | Object key path |
| VersionId | string | No | Specific version ID |
| DownloadToTemp | boolean | No | Download file to temp folder and return local path |
| AsText | boolean | No | Return file content as text for analysis |

#### PutObject
Upload content to an S3 object.
```json
{ "command": "PutObject", "params": { "Bucket": "my-bucket", "Key": "data.json", "Body": "{\"key\":\"value\"}", "ContentType": "application/json" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |
| Key | string | Yes | Object key path |
| Body | string | No | Object content as string or base64 |
| ContentType | string | No | MIME type for the object |
| Metadata | object | No | Custom metadata key-value pairs |

#### DeleteObject
Delete an object from a bucket.
```json
{ "command": "DeleteObject", "params": { "Bucket": "my-bucket", "Key": "old-file.txt" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |
| Key | string | Yes | Object key path |
| VersionId | string | No | Specific version ID to delete |

#### CopyObject
Copy an object within or between buckets.
```json
{ "command": "CopyObject", "params": { "Bucket": "dest-bucket", "Key": "dest-key.txt", "CopySource": "/source-bucket/source-key.txt" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Destination bucket name |
| Key | string | Yes | Destination object key |
| CopySource | string | Yes | Source object path (format: `/bucket/key`) |
| Metadata | object | No | Custom metadata key-value pairs |
| MetadataDirective | string | No | `COPY` or `REPLACE` — how to handle metadata |

#### SelectObjectContent
Query CSV/JSON/Parquet object content using SQL expressions.
```json
{
  "command": "SelectObjectContent",
  "params": {
    "Bucket": "my-bucket",
    "Key": "data.csv",
    "Expression": "SELECT * FROM s3object s WHERE s.age > 30",
    "ExpressionType": "SQL",
    "InputSerialization": { "CSV": { "FileHeaderInfo": "USE" } },
    "OutputSerialization": { "JSON": {} }
  }
}
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |
| Key | string | Yes | Object key path |
| Expression | string | Yes | SQL expression for querying |
| ExpressionType | string | Yes | Type of expression (always `SQL`) |
| InputSerialization | object | Yes | Format of input data (CSV, JSON, Parquet) |
| OutputSerialization | object | Yes | Format for output data (CSV, JSON) |

#### GetObjectAttributes
Get specific attributes of an object.
```json
{ "command": "GetObjectAttributes", "params": { "Bucket": "my-bucket", "Key": "file.txt", "ObjectAttributes": ["ObjectSize", "StorageClass"] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |
| Key | string | Yes | Object key path |
| ObjectAttributes | array | Yes | Attributes to retrieve: `ETag`, `Checksum`, `ObjectParts`, `StorageClass`, `ObjectSize` |
| ExpectedBucketOwner | string | No | Expected bucket owner account ID |

#### GetObjectLegalHold
Get the legal hold status of an object.
```json
{ "command": "GetObjectLegalHold", "params": { "Bucket": "my-bucket", "Key": "file.txt" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |
| Key | string | Yes | Object key path |
| ExpectedBucketOwner | string | No | Expected bucket owner account ID |

#### GetObjectRetention
Get the retention settings of an object.
```json
{ "command": "GetObjectRetention", "params": { "Bucket": "my-bucket", "Key": "file.txt" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |
| Key | string | Yes | Object key path |
| ExpectedBucketOwner | string | No | Expected bucket owner account ID |

### Bucket Configuration and Lifecycle Commands

#### CreateBucket
Create a new bucket.
```json
{ "command": "CreateBucket", "params": { "Bucket": "my-new-bucket" } }
```

#### DeleteBucket
Delete an empty bucket.
```json
{ "command": "DeleteBucket", "params": { "Bucket": "my-old-bucket" } }
```

#### PutBucketVersioning
Enable or suspend versioning.
```json
{ "command": "PutBucketVersioning", "params": { "Bucket": "my-bucket", "VersioningConfiguration": { "Status": "Enabled" } } }
```

#### PutBucketEncryption
Set default bucket encryption.
```json
{ "command": "PutBucketEncryption", "params": { "Bucket": "my-bucket", "ServerSideEncryptionConfiguration": { "Rules": [{ "ApplyServerSideEncryptionByDefault": { "SSEAlgorithm": "AES256" } }] } } }
```

#### PutBucketLifecycleConfiguration
Set lifecycle rules.
```json
{ "command": "PutBucketLifecycleConfiguration", "params": { "Bucket": "my-bucket", "LifecycleConfiguration": { "Rules": [] } } }
```

#### PutBucketTagging
Set bucket tags.
```json
{ "command": "PutBucketTagging", "params": { "Bucket": "my-bucket", "Tagging": { "TagSet": [{ "Key": "env", "Value": "prod" }] } } }
```

#### PutBucketPolicy
Set a bucket policy.
```json
{ "command": "PutBucketPolicy", "params": { "Bucket": "my-bucket", "Policy": "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":[\"s3:GetObject\"],\"Resource\":[\"arn:aws:s3:::my-bucket/*\"]}]}" } }
```

#### DeleteBucketPolicy
Delete a bucket policy.
```json
{ "command": "DeleteBucketPolicy", "params": { "Bucket": "my-bucket" } }
```

#### PutObjectTagging
Set object tags.
```json
{ "command": "PutObjectTagging", "params": { "Bucket": "my-bucket", "Key": "file.txt", "Tagging": { "TagSet": [{ "Key": "type", "Value": "report" }] } } }
```

#### DeleteObjectTagging
Remove object tags.
```json
{ "command": "DeleteObjectTagging", "params": { "Bucket": "my-bucket", "Key": "file.txt" } }
```

#### GetBucketLocation
Get the region where a bucket is located.
```json
{ "command": "GetBucketLocation", "params": { "Bucket": "my-bucket" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |
| ExpectedBucketOwner | string | No | Expected bucket owner account ID |

#### GetBucketEncryption
Get the default encryption configuration.
```json
{ "command": "GetBucketEncryption", "params": { "Bucket": "my-bucket" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |
| ExpectedBucketOwner | string | No | Expected bucket owner account ID |

#### GetBucketVersioning
Get the versioning state of a bucket.
```json
{ "command": "GetBucketVersioning", "params": { "Bucket": "my-bucket" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |
| ExpectedBucketOwner | string | No | Expected bucket owner account ID |

#### GetBucketLifecycleConfiguration
Get lifecycle configuration rules.
```json
{ "command": "GetBucketLifecycleConfiguration", "params": { "Bucket": "my-bucket" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |
| ExpectedBucketOwner | string | No | Expected bucket owner account ID |

#### GetBucketReplication
Get cross-region replication configuration.
```json
{ "command": "GetBucketReplication", "params": { "Bucket": "my-bucket" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |
| ExpectedBucketOwner | string | No | Expected bucket owner account ID |

#### GetBucketLogging
Get server access logging configuration.
```json
{ "command": "GetBucketLogging", "params": { "Bucket": "my-bucket" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |
| ExpectedBucketOwner | string | No | Expected bucket owner account ID |

#### GetBucketTagging
Get bucket tags.
```json
{ "command": "GetBucketTagging", "params": { "Bucket": "my-bucket" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |
| ExpectedBucketOwner | string | No | Expected bucket owner account ID |

#### GetBucketCors
Get CORS configuration.
```json
{ "command": "GetBucketCors", "params": { "Bucket": "my-bucket" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |
| ExpectedBucketOwner | string | No | Expected bucket owner account ID |

#### GetBucketWebsite
Get static website hosting configuration.
```json
{ "command": "GetBucketWebsite", "params": { "Bucket": "my-bucket" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |
| ExpectedBucketOwner | string | No | Expected bucket owner account ID |

#### GetBucketAccelerateConfiguration
Get transfer acceleration configuration.
```json
{ "command": "GetBucketAccelerateConfiguration", "params": { "Bucket": "my-bucket" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |
| ExpectedBucketOwner | string | No | Expected bucket owner account ID |

#### GetBucketRequestPayment
Get requester-pays configuration.
```json
{ "command": "GetBucketRequestPayment", "params": { "Bucket": "my-bucket" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |
| ExpectedBucketOwner | string | No | Expected bucket owner account ID |

#### GetBucketPolicy
Get the bucket policy JSON.
```json
{ "command": "GetBucketPolicy", "params": { "Bucket": "my-bucket" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |

#### GetBucketNotificationConfiguration
Get event notification configuration (triggers to SNS/SQS/Lambda).
```json
{ "command": "GetBucketNotificationConfiguration", "params": { "Bucket": "my-bucket" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |

#### OpenS3Explorer
Open the interactive S3 Explorer view for a bucket.
```json
{ "command": "OpenS3Explorer", "params": { "Bucket": "my-bucket", "Prefix": "data/" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | Bucket name |
| Key | string | No | Object key to focus on |
| Prefix | string | No | Prefix/folder to open |

---

## Related Services

- **S3 → SNS/SQS/Lambda**: Use `GetBucketNotificationConfiguration` to see event notification targets
- **S3 → CloudTrail**: S3 data events are logged to CloudTrail, viewable in CloudWatch Logs
- **S3 → Glue**: Glue crawlers catalog S3 data; Glue jobs read/write S3
- **S3 → EMR**: EMR clusters use S3 for input/output data (EMRFS)
- **S3 → CloudFormation**: S3 buckets are commonly managed by CloudFormation stacks
- **S3 → IAM**: Bucket policies and IAM policies control access; use `IAMTool` `SimulatePrincipalPolicy` to test
- **S3 File Operations**: For bulk upload/download of files and folders, use the `S3FileOperationsTool` (see awsflow-s3-fileops skill)
