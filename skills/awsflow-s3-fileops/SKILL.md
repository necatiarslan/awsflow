---
name: awsflow-s3-fileops
description: Upload and download files and folders to/from Amazon S3 with folder structure preservation using awsflow. Bulk file transfers, folder uploads, folder downloads.
---

# Awsflow S3 File Operations

Upload and download files and folders to/from S3 with folder structure preservation.

## When to Use This Skill

Use this skill when the user:

- Wants to upload one or multiple files to S3
- Wants to download one or multiple files from S3
- Needs to upload entire folders to S3 preserving directory structure
- Needs to download entire S3 prefixes/folders to local disk
- Asks about bulk file transfers to/from S3

## Tool: S3FileOperationsTool

Execute S3 file operations for bulk transfers. ALWAYS provide params object.

### Commands

#### UploadFile
Upload one or multiple local files to S3.
```json
{
  "command": "UploadFile",
  "params": {
    "Bucket": "my-bucket",
    "LocalPaths": ["/path/to/file1.txt", "/path/to/file2.csv"],
    "S3KeyPrefix": "uploads/",
    "ContentType": "text/plain"
  }
}
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | S3 bucket name |
| LocalPaths | array of strings | Yes | Array of local file paths to upload |
| S3KeyPrefix | string | No | S3 key prefix/folder to upload to |
| ContentType | string | No | MIME type for uploaded files |

#### DownloadFile
Download one or multiple files from S3 to a local directory.
```json
{
  "command": "DownloadFile",
  "params": {
    "Bucket": "my-bucket",
    "S3Keys": ["data/file1.csv", "data/file2.csv"],
    "LocalDirectory": "/path/to/local/dir"
  }
}
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | S3 bucket name |
| S3Keys | array of strings | Yes | Array of S3 object keys to download |
| LocalDirectory | string | Yes | Local directory path to download to |
| PreserveStructure | boolean | No | Whether to preserve folder structure |

#### UploadFolder
Upload local folders to S3 with preserved directory structure.
```json
{
  "command": "UploadFolder",
  "params": {
    "Bucket": "my-bucket",
    "LocalPaths": ["/path/to/local/folder"],
    "S3KeyPrefix": "backups/",
    "PreserveStructure": true
  }
}
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | S3 bucket name |
| LocalPaths | array of strings | Yes | Array of local folder paths to upload |
| S3KeyPrefix | string | No | S3 key prefix/folder to upload to |
| PreserveStructure | boolean | No | Whether to preserve folder structure |

#### DownloadFolder
Download entire S3 prefixes/folders to local disk with preserved structure.
```json
{
  "command": "DownloadFolder",
  "params": {
    "Bucket": "my-bucket",
    "S3KeyPrefixes": ["data/2024/", "data/2025/"],
    "LocalDirectory": "/path/to/local/dir",
    "PreserveStructure": true
  }
}
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Bucket | string | Yes | S3 bucket name |
| S3KeyPrefixes | array of strings | Yes | Array of S3 key prefixes/folders to download |
| LocalDirectory | string | Yes | Local directory path to download to |
| PreserveStructure | boolean | No | Whether to preserve folder structure |

---

## Related Services

- **S3Tool**: For object-level operations (list, get, put, delete, copy), bucket configuration, S3 Select queries, and S3 Explorer — see the `awsflow-s3` skill
- **Lambda**: Lambda functions commonly read/write S3 objects
- **Glue**: Glue crawlers catalog S3 data, ETL jobs process S3 files
- **CloudFormation**: S3 buckets and their configurations managed via stacks
