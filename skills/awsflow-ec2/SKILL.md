---
name: awsflow-ec2
description: Query AWS EC2 instances, instance types, images, VPCs, subnets, security groups, route tables, internet/NAT gateways, network interfaces, volumes, snapshots, key pairs, flow logs, tags, launch templates, transit gateways, VPC endpoints, and spot pricing using awsflow. All read-only commands.
---

# Awsflow EC2

Query EC2 compute and networking resources. All commands are read-only.

## When to Use This Skill

Use this skill when the user:

- Asks about EC2 instances, their status, or console output
- Wants to explore VPCs, subnets, security groups, or route tables
- Needs to list volumes, snapshots, or key pairs
- Wants to check instance types, pricing, or availability
- Asks about networking (internet gateways, NAT gateways, network interfaces, flow logs)
- Wants to inspect launch templates, transit gateways, or VPC endpoints

## Tool: EC2Tool

Execute AWS EC2 read-only and info commands. ALWAYS provide params object.

### Commands

#### DescribeInstances
Describe one or more EC2 instances.
```json
{ "command": "DescribeInstances", "params": { "InstanceIds": ["i-1234567890abcdef0"] } }
```
```json
{ "command": "DescribeInstances", "params": { "Filters": [{ "Name": "instance-state-name", "Values": ["running"] }] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| InstanceIds | array of strings | No | List of instance IDs |
| Filters | array of objects | No | EC2 filter array with `Name` and `Values[]` |
| MaxResults | number | No | Maximum results per page |
| NextToken | string | No | Pagination token |
| DryRun | boolean | No | Validate permissions without running |

#### DescribeInstanceStatus
Get status checks for instances.
```json
{ "command": "DescribeInstanceStatus", "params": { "InstanceIds": ["i-1234567890abcdef0"] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| InstanceIds | array of strings | No | List of instance IDs |
| Filters | array of objects | No | Filter array |
| DryRun | boolean | No | Validate permissions without running |

#### DescribeInstanceTypes
Get details about instance types (CPU, memory, networking).
```json
{ "command": "DescribeInstanceTypes", "params": { "InstanceTypes": ["t3.micro", "m5.large"] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| InstanceTypes | array of strings | No | Instance type names to describe |
| Filters | array of objects | No | Filter array |

#### DescribeInstanceTypeOfferings
List instance types available in specific locations.
```json
{ "command": "DescribeInstanceTypeOfferings", "params": { "LocationType": "availability-zone", "Filters": [{ "Name": "instance-type", "Values": ["t3.*"] }] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| LocationType | string | No | `region`, `availability-zone`, or `availability-zone-id` |
| Filters | array of objects | No | Filter array |

#### DescribeImages
Describe AMIs (Amazon Machine Images).
```json
{ "command": "DescribeImages", "params": { "Owners": ["self"], "Filters": [{ "Name": "state", "Values": ["available"] }] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Owners | array of strings | No | Image owners (`self`, `amazon`, account ID) |
| Filters | array of objects | No | Filter array |
| MaxResults | number | No | Maximum results |
| NextToken | string | No | Pagination token |
| DryRun | boolean | No | Validate permissions |

#### DescribeVpcs
Describe VPCs.
```json
{ "command": "DescribeVpcs", "params": {} }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Filters | array of objects | No | Filter array |
| DryRun | boolean | No | Validate permissions |

#### DescribeSubnets
Describe subnets.
```json
{ "command": "DescribeSubnets", "params": { "Filters": [{ "Name": "vpc-id", "Values": ["vpc-12345"] }] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Filters | array of objects | No | Filter array |
| DryRun | boolean | No | Validate permissions |

#### DescribeSecurityGroups
Describe security groups.
```json
{ "command": "DescribeSecurityGroups", "params": { "GroupIds": ["sg-12345"] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| GroupIds | array of strings | No | Security group IDs |
| Filters | array of objects | No | Filter array |
| DryRun | boolean | No | Validate permissions |

#### DescribeSecurityGroupRules
Describe security group rules.
```json
{ "command": "DescribeSecurityGroupRules", "params": { "Filters": [{ "Name": "group-id", "Values": ["sg-12345"] }] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| GroupIds | array of strings | No | Security group IDs |
| Filters | array of objects | No | Filter array |

#### DescribeVolumes
Describe EBS volumes.
```json
{ "command": "DescribeVolumes", "params": { "Filters": [{ "Name": "attachment.instance-id", "Values": ["i-12345"] }] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Filters | array of objects | No | Filter array |
| MaxResults | number | No | Maximum results |
| NextToken | string | No | Pagination token |
| DryRun | boolean | No | Validate permissions |

#### DescribeSnapshots
Describe EBS snapshots.
```json
{ "command": "DescribeSnapshots", "params": { "Filters": [{ "Name": "volume-id", "Values": ["vol-12345"] }] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Filters | array of objects | No | Filter array |
| MaxResults | number | No | Maximum results |
| NextToken | string | No | Pagination token |
| DryRun | boolean | No | Validate permissions |

#### DescribeKeyPairs
Describe key pairs.
```json
{ "command": "DescribeKeyPairs", "params": {} }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Filters | array of objects | No | Filter array |
| DryRun | boolean | No | Validate permissions |

#### DescribeAddresses
Describe Elastic IP addresses.
```json
{ "command": "DescribeAddresses", "params": {} }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Filters | array of objects | No | Filter array |
| DryRun | boolean | No | Validate permissions |

#### DescribeRegions
Describe available AWS regions.
```json
{ "command": "DescribeRegions", "params": {} }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| RegionNames | array of strings | No | Specific region names |
| Filters | array of objects | No | Filter array |
| DryRun | boolean | No | Validate permissions |

#### DescribeAvailabilityZones
Describe availability zones.
```json
{ "command": "DescribeAvailabilityZones", "params": {} }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Filters | array of objects | No | Filter array |
| DryRun | boolean | No | Validate permissions |

#### DescribeRouteTables
Describe route tables.
```json
{ "command": "DescribeRouteTables", "params": { "Filters": [{ "Name": "vpc-id", "Values": ["vpc-12345"] }] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| RouteTableIds | array of strings | No | Route table IDs |
| Filters | array of objects | No | Filter array |

#### DescribeInternetGateways
Describe internet gateways.
```json
{ "command": "DescribeInternetGateways", "params": { "InternetGatewayIds": ["igw-12345"] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| InternetGatewayIds | array of strings | No | Internet gateway IDs |
| Filters | array of objects | No | Filter array |

#### DescribeNatGateways
Describe NAT gateways.
```json
{ "command": "DescribeNatGateways", "params": { "NatGatewayIds": ["nat-12345"] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| NatGatewayIds | array of strings | No | NAT gateway IDs |
| Filters | array of objects | No | Filter array |

#### DescribeNetworkInterfaces
Describe network interfaces.
```json
{ "command": "DescribeNetworkInterfaces", "params": { "Filters": [{ "Name": "vpc-id", "Values": ["vpc-12345"] }] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| NetworkInterfaceIds | array of strings | No | Network interface IDs |
| Filters | array of objects | No | Filter array |

#### DescribeFlowLogs
Describe VPC flow logs.
```json
{ "command": "DescribeFlowLogs", "params": { "FlowLogIds": ["fl-12345"] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| FlowLogIds | array of strings | No | Flow log IDs |
| Filters | array of objects | No | Filter array |

#### DescribeTags
Describe tags across EC2 resources.
```json
{ "command": "DescribeTags", "params": { "Filters": [{ "Name": "resource-id", "Values": ["i-12345"] }] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Filters | array of objects | No | Filter array |
| DryRun | boolean | No | Validate permissions |

#### DescribeLaunchTemplates
Describe launch templates.
```json
{ "command": "DescribeLaunchTemplates", "params": { "LaunchTemplateIds": ["lt-12345"] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| LaunchTemplateIds | array of strings | No | Launch template IDs |
| LaunchTemplateNames | array of strings | No | Launch template names |
| Filters | array of objects | No | Filter array |

#### DescribeTransitGateways
Describe transit gateways.
```json
{ "command": "DescribeTransitGateways", "params": { "TransitGatewayIds": ["tgw-12345"] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| TransitGatewayIds | array of strings | No | Transit gateway IDs |
| Filters | array of objects | No | Filter array |

#### DescribeVpcEndpoints
Describe VPC endpoints.
```json
{ "command": "DescribeVpcEndpoints", "params": { "VpcEndpointIds": ["vpce-12345"] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| VpcEndpointIds | array of strings | No | VPC endpoint IDs |
| Filters | array of objects | No | Filter array |

#### DescribeVpcPeeringConnections
Describe VPC peering connections.
```json
{ "command": "DescribeVpcPeeringConnections", "params": { "VpcPeeringConnectionIds": ["pcx-12345"] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| VpcPeeringConnectionIds | array of strings | No | Peering connection IDs |
| Filters | array of objects | No | Filter array |

#### DescribeSpotPriceHistory
Get spot instance pricing history.
```json
{ "command": "DescribeSpotPriceHistory", "params": { "InstanceTypes": ["m5.large"], "ProductDescriptions": ["Linux/UNIX"], "StartTime": "2024-01-01T00:00:00Z" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| InstanceTypes | array of strings | No | Instance type names |
| ProductDescriptions | array of strings | No | Product descriptions |
| StartTime | string | No | Start time for history |
| EndTime | string | No | End time for history |
| Filters | array of objects | No | Filter array |

#### DescribeAccountAttributes
Describe EC2 account attributes (limits).
```json
{ "command": "DescribeAccountAttributes", "params": {} }
```
**Parameters:** None required.

#### GetConsoleOutput
Get the console output from an instance.
```json
{ "command": "GetConsoleOutput", "params": { "InstanceId": "i-1234567890abcdef0" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| InstanceId | string | Yes | Instance ID |

#### GetLaunchTemplateData
Get launch template data from an instance.
```json
{ "command": "GetLaunchTemplateData", "params": { "InstanceId": "i-1234567890abcdef0" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| InstanceId | string | Yes | Instance ID |

#### GetPasswordData
Get Windows instance password data.
```json
{ "command": "GetPasswordData", "params": { "InstanceId": "i-1234567890abcdef0" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| InstanceId | string | Yes | Instance ID |

#### GetHostReservationPurchasePreview
Preview a host reservation purchase.
```json
{ "command": "GetHostReservationPurchasePreview", "params": {} }
```

---

## Related Services

- **EC2 → CloudWatch**: VPC Flow Logs deliver to CloudWatch Log Groups. Use `DescribeFlowLogs` to find the log group name, then `CloudWatchLogTool` to read logs
- **EC2 → VPC/Subnet/SecurityGroup**: Instance metadata contains `vpcId`, `subnetId`, `securityGroups` — use these IDs with `DescribeVpcs`, `DescribeSubnets`, `DescribeSecurityGroups`
- **EC2 → IAM**: Instance profiles link to IAM roles. Use `IAMTool` to inspect the role
- **EC2 → CloudFormation**: EC2 instances created by CloudFormation can be found via `CloudFormationTool` `DescribeStackResources`
- **EC2 → S3**: Instances use S3 for user data scripts, AMI snapshots; check instance user data for S3 references
- **EC2 → EBS**: Use `DescribeVolumes` with filter `attachment.instance-id` to find volumes attached to an instance
