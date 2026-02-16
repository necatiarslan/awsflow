---
name: awsflow-ec2
description: Manage and query AWS EC2 resources including launching/stopping/terminating instances, creating VPCs and subnets, managing security groups, volumes, snapshots, AMIs, and querying all EC2 resource types using awsflow. Full lifecycle management.
---

# Awsflow EC2

Manage EC2 compute and networking resources with full lifecycle operations including creation, modification, and deletion.

## When to Use This Skill

Use this skill when the user:

- Wants to launch, start, stop, terminate, or reboot EC2 instances
- Needs to create or delete VPCs, subnets, security groups, or route tables
- Wants to manage security group rules (ingress/egress)
- Needs to create, attach, or delete EBS volumes and snapshots
- Wants to create AMIs or manage launch templates
- Needs to allocate Elastic IPs or manage internet/NAT gateways
- Wants to tag resources
- Asks about EC2 instances, their status, or console output
- Wants to explore VPCs, subnets, security groups, or route tables
- Needs to list volumes, snapshots, or key pairs
- Wants to check instance types, pricing, or availability
- Asks about networking (internet gateways, NAT gateways, network interfaces, flow logs)
- Wants to inspect launch templates, transit gateways, or VPC endpoints

## Tool: EC2Tool

Execute AWS EC2 commands for managing compute and network resources. ALWAYS provide params object. Supports read operations, instance lifecycle (launch, start, stop, terminate, reboot), VPC/network creation and configuration (VPCs, subnets, security groups, internet/NAT gateways, route tables), storage (volumes, snapshots, AMIs), and resource tagging.

### Lifecycle Management Commands

#### RunInstances
Launch new EC2 instances.
```json
{ "command": "RunInstances", "params": { "ImageId": "ami-0abcdef1234567890", "InstanceType": "t3.micro", "MinCount": 1, "MaxCount": 1, "KeyName": "my-key", "SecurityGroupIds": ["sg-12345"], "SubnetId": "subnet-12345" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ImageId | string | Yes | AMI ID to launch |
| InstanceType | string | Yes | Instance type (e.g., t3.micro, m5.large) |
| MinCount | number | Yes | Minimum number of instances |
| MaxCount | number | Yes | Maximum number of instances |
| KeyName | string | No | SSH key pair name |
| SecurityGroupIds | array of strings | No | Security group IDs |
| SubnetId | string | No | Subnet ID for placement |
| UserData | string | No | Base64-encoded startup script |
| Tags | array of objects | No | Resource tags |

#### TerminateInstances
Terminate EC2 instances.
```json
{ "command": "TerminateInstances", "params": { "InstanceIds": ["i-1234567890abcdef0"] } }
```

#### StopInstances
Stop running instances.
```json
{ "command": "StopInstances", "params": { "InstanceIds": ["i-1234567890abcdef0"], "Force": false } }
```

#### StartInstances
Start stopped instances.
```json
{ "command": "StartInstances", "params": { "InstanceIds": ["i-1234567890abcdef0"] } }
```

#### RebootInstances
Reboot instances.
```json
{ "command": "RebootInstances", "params": { "InstanceIds": ["i-1234567890abcdef0"] } }
```

### VPC and Network Management

#### CreateVpc
Create a new VPC.
```json
{ "command": "CreateVpc", "params": { "CidrBlock": "10.0.0.0/16", "Tags": [{ "Key": "Name", "Value": "MyVPC" }] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| CidrBlock | string | Yes | CIDR block (e.g., 10.0.0.0/16) |
| Tags | array of objects | No | Resource tags |

#### DeleteVpc
```json
{ "command": "DeleteVpc", "params": { "VpcId": "vpc-12345" } }
```

#### CreateSubnet
Create a subnet in a VPC.
```json
{ "command": "CreateSubnet", "params": { "VpcId": "vpc-12345", "CidrBlock": "10.0.1.0/24", "AvailabilityZone": "us-east-1a" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| VpcId | string | Yes | VPC ID |
| CidrBlock | string | Yes | Subnet CIDR block |
| AvailabilityZone | string | No | AZ for subnet |

#### DeleteSubnet
```json
{ "command": "DeleteSubnet", "params": { "SubnetId": "subnet-12345" } }
```

#### CreateSecurityGroup
Create a security group.
```json
{ "command": "CreateSecurityGroup", "params": { "GroupName": "MySecurityGroup", "Description": "My security group description", "VpcId": "vpc-12345" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| GroupName | string | Yes | Security group name |
| Description | string | Yes | Security group description |
| VpcId | string | Yes | VPC ID |

#### DeleteSecurityGroup
```json
{ "command": "DeleteSecurityGroup", "params": { "GroupId": "sg-12345" } }
```

#### AuthorizeSecurityGroupIngress
Add inbound rules to security group.
```json
{ "command": "AuthorizeSecurityGroupIngress", "params": { "GroupId": "sg-12345", "IpPermissions": [{ "IpProtocol": "tcp", "FromPort": 22, "ToPort": 22, "IpRanges": [{ "CidrIp": "0.0.0.0/0" }] }] } }
```

#### AuthorizeSecurityGroupEgress
Add outbound rules to security group.
```json
{ "command": "AuthorizeSecurityGroupEgress", "params": { "GroupId": "sg-12345", "IpPermissions": [{ "IpProtocol": "-1", "IpRanges": [{ "CidrIp": "0.0.0.0/0" }] }] } }
```

#### RevokeSecurityGroupIngress
Remove inbound rules.
```json
{ "command": "RevokeSecurityGroupIngress", "params": { "GroupId": "sg-12345", "IpPermissions": [{ "IpProtocol": "tcp", "FromPort": 22, "ToPort": 22 }] } }
```

#### RevokeSecurityGroupEgress
Remove outbound rules.
```json
{ "command": "RevokeSecurityGroupEgress", "params": { "GroupId": "sg-12345", "IpPermissions": [{ "IpProtocol": "-1" }] } }
```

### Storage Management

#### CreateVolume
Create an EBS volume.
```json
{ "command": "CreateVolume", "params": { "AvailabilityZone": "us-east-1a", "Size": 100, "VolumeType": "gp3", "Tags": [{ "Key": "Name", "Value": "MyVolume" }] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| AvailabilityZone | string | Yes | AZ for volume |
| Size | number | No | Size in GiB |
| VolumeType | string | No | gp2, gp3, io1, io2, st1, sc1 |
| SnapshotId | string | No | Create from snapshot |

#### DeleteVolume
```json
{ "command": "DeleteVolume", "params": { "VolumeId": "vol-12345" } }
```

#### AttachVolume
Attach volume to instance.
```json
{ "command": "AttachVolume", "params": { "VolumeId": "vol-12345", "InstanceId": "i-12345", "Device": "/dev/sdf" } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| VolumeId | string | Yes | Volume ID |
| InstanceId | string | Yes | Instance ID |
| Device | string | Yes | Device name (/dev/sdf) |

#### DetachVolume
```json
{ "command": "DetachVolume", "params": { "VolumeId": "vol-12345", "Force": false } }
```

#### CreateSnapshot
Create snapshot from volume.
```json
{ "command": "CreateSnapshot", "params": { "VolumeId": "vol-12345", "Description": "My snapshot" } }
```

#### DeleteSnapshot
```json
{ "command": "DeleteSnapshot", "params": { "SnapshotId": "snap-12345" } }
```

#### CreateImage
Create AMI from instance.
```json
{ "command": "CreateImage", "params": { "InstanceId": "i-12345", "Name": "MyAMI", "Description": "My custom AMI", "NoReboot": true } }
```

#### DeregisterImage
Delete an AMI.
```json
{ "command": "DeregisterImage", "params": { "ImageId": "ami-12345" } }
```

### Resource Tagging

#### CreateTags
Add tags to resources.
```json
{ "command": "CreateTags", "params": { "Resources": ["i-12345", "vol-12345"], "Tags": [{ "Key": "Environment", "Value": "Production" }] } }
```
**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Resources | array of strings | Yes | Resource IDs to tag |
| Tags | array of objects | Yes | Tag key-value pairs |

#### DeleteTags
Remove tags from resources.
```json
{ "command": "DeleteTags", "params": { "Resources": ["i-12345"], "Tags": [{ "Key": "Environment" }] } }
```

### Networking - Gateways and Routes

#### CreateInternetGateway
Create internet gateway.
```json
{ "command": "CreateInternetGateway", "params": {} }
```

#### AttachInternetGateway
Attach internet gateway to VPC.
```json
{ "command": "AttachInternetGateway", "params": { "InternetGatewayId": "igw-12345", "VpcId": "vpc-12345" } }
```

#### DetachInternetGateway
```json
{ "command": "DetachInternetGateway", "params": { "InternetGatewayId": "igw-12345", "VpcId": "vpc-12345" } }
```

#### DeleteInternetGateway
```json
{ "command": "DeleteInternetGateway", "params": { "InternetGatewayId": "igw-12345" } }
```

#### CreateNatGateway
Create NAT gateway.
```json
{ "command": "CreateNatGateway", "params": { "SubnetId": "subnet-12345", "AllocationId": "eipalloc-12345" } }
```

#### DeleteNatGateway
```json
{ "command": "DeleteNatGateway", "params": { "NatGatewayId": "nat-12345" } }
```

#### CreateRouteTable
Create route table.
```json
{ "command": "CreateRouteTable", "params": { "VpcId": "vpc-12345" } }
```

#### DeleteRouteTable
```json
{ "command": "DeleteRouteTable", "params": { "RouteTableId": "rtb-12345" } }
```

#### CreateRoute
Add route to route table.
```json
{ "command": "CreateRoute", "params": { "RouteTableId": "rtb-12345", "DestinationCidrBlock": "0.0.0.0/0", "GatewayId": "igw-12345" } }
```

#### DeleteRoute
```json
{ "command": "DeleteRoute", "params": { "RouteTableId": "rtb-12345", "DestinationCidrBlock": "0.0.0.0/0" } }
```

#### AssociateRouteTable
Associate route table with subnet.
```json
{ "command": "AssociateRouteTable", "params": { "RouteTableId": "rtb-12345", "SubnetId": "subnet-12345" } }
```

#### DisassociateRouteTable
```json
{ "command": "DisassociateRouteTable", "params": { "AssociationId": "rtbassoc-12345" } }
```

### Elastic IPs

#### AllocateAddress
Allocate Elastic IP.
```json
{ "command": "AllocateAddress", "params": { "Domain": "vpc" } }
```

#### ReleaseAddress
Release Elastic IP.
```json
{ "command": "ReleaseAddress", "params": { "AllocationId": "eipalloc-12345" } }
```

#### AssociateAddress
Associate Elastic IP with instance.
```json
{ "command": "AssociateAddress", "params": { "AllocationId": "eipalloc-12345", "InstanceId": "i-12345" } }
```

#### DisassociateAddress
```json
{ "command": "DisassociateAddress", "params": { "AssociationId": "eipassoc-12345" } }
```

### Key Pairs and Launch Templates

#### CreateKeyPair
Create SSH key pair.
```json
{ "command": "CreateKeyPair", "params": { "KeyName": "my-key-pair" } }
```

#### DeleteKeyPair
```json
{ "command": "DeleteKeyPair", "params": { "KeyName": "my-key-pair" } }
```

#### CreateLaunchTemplate
Create launch template.
```json
{ "command": "CreateLaunchTemplate", "params": { "LaunchTemplateName": "MyTemplate", "LaunchTemplateData": { "ImageId": "ami-12345", "InstanceType": "t3.micro" } } }
```

#### DeleteLaunchTemplate
```json
{ "command": "DeleteLaunchTemplate", "params": { "LaunchTemplateId": "lt-12345" } }
```

### Query Commands

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
