import { BaseTool, BaseToolInput } from '../common/BaseTool';
import { ClientManager } from '../common/ClientManager';
import { AIHandler } from '../chat/AIHandler';
import {
  EC2Client,
  DescribeAccountAttributesCommand,
  DescribeAddressesCommand,
  DescribeAvailabilityZonesCommand,
  DescribeImagesCommand,
  DescribeInstancesCommand,
  DescribeInstanceStatusCommand,
  DescribeKeyPairsCommand,
  DescribeRegionsCommand,
  DescribeSecurityGroupsCommand,
  DescribeSnapshotsCommand,
  DescribeSubnetsCommand,
  DescribeTagsCommand,
  DescribeVolumesCommand,
  DescribeVpcsCommand,
  GetConsoleOutputCommand,
  GetHostReservationPurchasePreviewCommand,
  GetLaunchTemplateDataCommand,
  GetPasswordDataCommand,
  DescribeInstanceTypesCommand,
  DescribeNetworkInterfacesCommand,
  DescribeRouteTablesCommand,
  DescribeInternetGatewaysCommand,
  DescribeNatGatewaysCommand,
  DescribeSecurityGroupRulesCommand,
  DescribeLaunchTemplatesCommand,
  DescribeInstanceTypeOfferingsCommand,
  DescribeFlowLogsCommand,
  DescribeTransitGatewaysCommand,
  DescribeVpcPeeringConnectionsCommand,
  DescribeVpcEndpointsCommand,
  DescribeSpotPriceHistoryCommand,
  RunInstancesCommand,
  TerminateInstancesCommand,
  StopInstancesCommand,
  StartInstancesCommand,
  RebootInstancesCommand,
  CreateVpcCommand,
  DeleteVpcCommand,
  CreateSubnetCommand,
  DeleteSubnetCommand,
  CreateSecurityGroupCommand,
  DeleteSecurityGroupCommand,
  AuthorizeSecurityGroupIngressCommand,
  AuthorizeSecurityGroupEgressCommand,
  RevokeSecurityGroupIngressCommand,
  RevokeSecurityGroupEgressCommand,
  CreateKeyPairCommand,
  DeleteKeyPairCommand,
  CreateVolumeCommand,
  DeleteVolumeCommand,
  AttachVolumeCommand,
  DetachVolumeCommand,
  CreateSnapshotCommand,
  DeleteSnapshotCommand,
  CreateImageCommand,
  DeregisterImageCommand,
  CreateTagsCommand,
  DeleteTagsCommand,
  CreateInternetGatewayCommand,
  DeleteInternetGatewayCommand,
  AttachInternetGatewayCommand,
  DetachInternetGatewayCommand,
  CreateNatGatewayCommand,
  DeleteNatGatewayCommand,
  CreateRouteTableCommand,
  DeleteRouteTableCommand,
  CreateRouteCommand,
  DeleteRouteCommand,
  AssociateRouteTableCommand,
  DisassociateRouteTableCommand,
  CreateLaunchTemplateCommand,
  DeleteLaunchTemplateCommand,
  AllocateAddressCommand,
  ReleaseAddressCommand,
  AssociateAddressCommand,
  DisassociateAddressCommand,
} from '@aws-sdk/client-ec2';

type EC2Command =
  | 'DescribeAccountAttributes'
  | 'DescribeAddresses'
  | 'DescribeAvailabilityZones'
  | 'DescribeImages'
  | 'DescribeInstances'
  | 'DescribeInstanceStatus'
  | 'DescribeKeyPairs'
  | 'DescribeRegions'
  | 'DescribeSecurityGroups'
  | 'DescribeSnapshots'
  | 'DescribeSubnets'
  | 'DescribeTags'
  | 'DescribeVolumes'
  | 'DescribeVpcs'
  | 'GetConsoleOutput'
  | 'GetHostReservationPurchasePreview'
  | 'GetLaunchTemplateData'
  | 'GetPasswordData'
  | 'DescribeInstanceTypes'
  | 'DescribeNetworkInterfaces'
  | 'DescribeRouteTables'
  | 'DescribeInternetGateways'
  | 'DescribeNatGateways'
  | 'DescribeSecurityGroupRules'
  | 'DescribeLaunchTemplates'
  | 'DescribeInstanceTypeOfferings'
  | 'DescribeFlowLogs'
  | 'DescribeTransitGateways'
  | 'DescribeVpcPeeringConnections'
  | 'DescribeVpcEndpoints'
  | 'DescribeSpotPriceHistory'
  | 'RunInstances'
  | 'TerminateInstances'
  | 'StopInstances'
  | 'StartInstances'
  | 'RebootInstances'
  | 'CreateVpc'
  | 'DeleteVpc'
  | 'CreateSubnet'
  | 'DeleteSubnet'
  | 'CreateSecurityGroup'
  | 'DeleteSecurityGroup'
  | 'AuthorizeSecurityGroupIngress'
  | 'AuthorizeSecurityGroupEgress'
  | 'RevokeSecurityGroupIngress'
  | 'RevokeSecurityGroupEgress'
  | 'CreateKeyPair'
  | 'DeleteKeyPair'
  | 'CreateVolume'
  | 'DeleteVolume'
  | 'AttachVolume'
  | 'DetachVolume'
  | 'CreateSnapshot'
  | 'DeleteSnapshot'
  | 'CreateImage'
  | 'DeregisterImage'
  | 'CreateTags'
  | 'DeleteTags'
  | 'CreateInternetGateway'
  | 'DeleteInternetGateway'
  | 'AttachInternetGateway'
  | 'DetachInternetGateway'
  | 'CreateNatGateway'
  | 'DeleteNatGateway'
  | 'CreateRouteTable'
  | 'DeleteRouteTable'
  | 'CreateRoute'
  | 'DeleteRoute'
  | 'AssociateRouteTable'
  | 'DisassociateRouteTable'
  | 'CreateLaunchTemplate'
  | 'DeleteLaunchTemplate'
  | 'AllocateAddress'
  | 'ReleaseAddress'
  | 'AssociateAddress'
  | 'DisassociateAddress';

interface EC2ToolInput extends BaseToolInput {
  command: EC2Command;
}

export class EC2Tool extends BaseTool<EC2ToolInput> {
  protected readonly toolName = 'EC2Tool';

  private async getClient(): Promise<EC2Client> {
    return ClientManager.Instance.getClient('ec2', async (session) => {
      const credentials = await session.GetCredentials();
      return new EC2Client({
        credentials,
        endpoint: session.AwsEndPoint,
        region: session.AwsRegion,
      });
    });
  }

  protected updateResourceContext(command: string, params: Record<string, any>): void {
    if (params?.InstanceId || (Array.isArray(params?.InstanceIds) && params.InstanceIds.length > 0)) {
        const name = params.InstanceId || params.InstanceIds?.[0];
        AIHandler.Current.updateLatestResource({ type: 'EC2 Instance', name });
    }
    if (params?.VpcId) {
        AIHandler.Current.updateLatestResource({ type: 'VPC', name: params.VpcId });
    }
    if (params?.SubnetId) {
        AIHandler.Current.updateLatestResource({ type: 'Subnet', name: params.SubnetId });
    }
    if (params?.GroupId || params?.GroupName) {
        const name = params.GroupId || params.GroupName;
        AIHandler.Current.updateLatestResource({ type: 'Security Group', name });
    }
    if (params?.VolumeId) {
        AIHandler.Current.updateLatestResource({ type: 'EBS Volume', name: params.VolumeId });
    }
    if (params?.SnapshotId) {
        AIHandler.Current.updateLatestResource({ type: 'Snapshot', name: params.SnapshotId });
    }
    if (params?.ImageId) {
        AIHandler.Current.updateLatestResource({ type: 'AMI', name: params.ImageId });
    }
  }

  protected async executeCommand(command: EC2Command, params: Record<string, any>): Promise<any> {
    const client = await this.getClient();

    switch (command) {
      case 'DescribeAccountAttributes':
        return await client.send(new DescribeAccountAttributesCommand(params as any));
      case 'DescribeAddresses':
        return await client.send(new DescribeAddressesCommand(params as any));
      case 'DescribeAvailabilityZones':
        return await client.send(new DescribeAvailabilityZonesCommand(params as any));
      case 'DescribeImages':
        return await client.send(new DescribeImagesCommand(params as any));
      case 'DescribeInstances':
        return await client.send(new DescribeInstancesCommand(params as any));
      case 'DescribeInstanceStatus':
        return await client.send(new DescribeInstanceStatusCommand(params as any));
      case 'DescribeKeyPairs':
        return await client.send(new DescribeKeyPairsCommand(params as any));
      case 'DescribeRegions':
        return await client.send(new DescribeRegionsCommand(params as any));
      case 'DescribeSecurityGroups':
        return await client.send(new DescribeSecurityGroupsCommand(params as any));
      case 'DescribeSnapshots':
        return await client.send(new DescribeSnapshotsCommand(params as any));
      case 'DescribeSubnets':
        return await client.send(new DescribeSubnetsCommand(params as any));
      case 'DescribeTags':
        return await client.send(new DescribeTagsCommand(params as any));
      case 'DescribeVolumes':
        return await client.send(new DescribeVolumesCommand(params as any));
      case 'DescribeVpcs':
        return await client.send(new DescribeVpcsCommand(params as any));
      case 'GetConsoleOutput':
        return await client.send(new GetConsoleOutputCommand(params as any));
      case 'GetHostReservationPurchasePreview':
        return await client.send(new GetHostReservationPurchasePreviewCommand(params as any));
      case 'GetLaunchTemplateData':
        return await client.send(new GetLaunchTemplateDataCommand(params as any));
      case 'GetPasswordData':
        return await client.send(new GetPasswordDataCommand(params as any));
      case 'DescribeInstanceTypes':
        return await client.send(new DescribeInstanceTypesCommand(params as any));
      case 'DescribeNetworkInterfaces':
        return await client.send(new DescribeNetworkInterfacesCommand(params as any));
      case 'DescribeRouteTables':
        return await client.send(new DescribeRouteTablesCommand(params as any));
      case 'DescribeInternetGateways':
        return await client.send(new DescribeInternetGatewaysCommand(params as any));
      case 'DescribeNatGateways':
        return await client.send(new DescribeNatGatewaysCommand(params as any));
      case 'DescribeSecurityGroupRules':
        return await client.send(new DescribeSecurityGroupRulesCommand(params as any));
      case 'DescribeLaunchTemplates':
        return await client.send(new DescribeLaunchTemplatesCommand(params as any));
      case 'DescribeInstanceTypeOfferings':
        return await client.send(new DescribeInstanceTypeOfferingsCommand(params as any));
      case 'DescribeFlowLogs':
        return await client.send(new DescribeFlowLogsCommand(params as any));
      case 'DescribeTransitGateways':
        return await client.send(new DescribeTransitGatewaysCommand(params as any));
      case 'DescribeVpcPeeringConnections':
        return await client.send(new DescribeVpcPeeringConnectionsCommand(params as any));
      case 'DescribeVpcEndpoints':
        return await client.send(new DescribeVpcEndpointsCommand(params as any));
      case 'DescribeSpotPriceHistory':
        return await client.send(new DescribeSpotPriceHistoryCommand(params as any));
      case 'RunInstances':
        return await client.send(new RunInstancesCommand(params as any));
      case 'TerminateInstances':
        return await client.send(new TerminateInstancesCommand(params as any));
      case 'StopInstances':
        return await client.send(new StopInstancesCommand(params as any));
      case 'StartInstances':
        return await client.send(new StartInstancesCommand(params as any));
      case 'RebootInstances':
        return await client.send(new RebootInstancesCommand(params as any));
      case 'CreateVpc':
        return await client.send(new CreateVpcCommand(params as any));
      case 'DeleteVpc':
        return await client.send(new DeleteVpcCommand(params as any));
      case 'CreateSubnet':
        return await client.send(new CreateSubnetCommand(params as any));
      case 'DeleteSubnet':
        return await client.send(new DeleteSubnetCommand(params as any));
      case 'CreateSecurityGroup':
        return await client.send(new CreateSecurityGroupCommand(params as any));
      case 'DeleteSecurityGroup':
        return await client.send(new DeleteSecurityGroupCommand(params as any));
      case 'AuthorizeSecurityGroupIngress':
        return await client.send(new AuthorizeSecurityGroupIngressCommand(params as any));
      case 'AuthorizeSecurityGroupEgress':
        return await client.send(new AuthorizeSecurityGroupEgressCommand(params as any));
      case 'RevokeSecurityGroupIngress':
        return await client.send(new RevokeSecurityGroupIngressCommand(params as any));
      case 'RevokeSecurityGroupEgress':
        return await client.send(new RevokeSecurityGroupEgressCommand(params as any));
      case 'CreateKeyPair':
        return await client.send(new CreateKeyPairCommand(params as any));
      case 'DeleteKeyPair':
        return await client.send(new DeleteKeyPairCommand(params as any));
      case 'CreateVolume':
        return await client.send(new CreateVolumeCommand(params as any));
      case 'DeleteVolume':
        return await client.send(new DeleteVolumeCommand(params as any));
      case 'AttachVolume':
        return await client.send(new AttachVolumeCommand(params as any));
      case 'DetachVolume':
        return await client.send(new DetachVolumeCommand(params as any));
      case 'CreateSnapshot':
        return await client.send(new CreateSnapshotCommand(params as any));
      case 'DeleteSnapshot':
        return await client.send(new DeleteSnapshotCommand(params as any));
      case 'CreateImage':
        return await client.send(new CreateImageCommand(params as any));
      case 'DeregisterImage':
        return await client.send(new DeregisterImageCommand(params as any));
      case 'CreateTags':
        return await client.send(new CreateTagsCommand(params as any));
      case 'DeleteTags':
        return await client.send(new DeleteTagsCommand(params as any));
      case 'CreateInternetGateway':
        return await client.send(new CreateInternetGatewayCommand(params as any));
      case 'DeleteInternetGateway':
        return await client.send(new DeleteInternetGatewayCommand(params as any));
      case 'AttachInternetGateway':
        return await client.send(new AttachInternetGatewayCommand(params as any));
      case 'DetachInternetGateway':
        return await client.send(new DetachInternetGatewayCommand(params as any));
      case 'CreateNatGateway':
        return await client.send(new CreateNatGatewayCommand(params as any));
      case 'DeleteNatGateway':
        return await client.send(new DeleteNatGatewayCommand(params as any));
      case 'CreateRouteTable':
        return await client.send(new CreateRouteTableCommand(params as any));
      case 'DeleteRouteTable':
        return await client.send(new DeleteRouteTableCommand(params as any));
      case 'CreateRoute':
        return await client.send(new CreateRouteCommand(params as any));
      case 'DeleteRoute':
        return await client.send(new DeleteRouteCommand(params as any));
      case 'AssociateRouteTable':
        return await client.send(new AssociateRouteTableCommand(params as any));
      case 'DisassociateRouteTable':
        return await client.send(new DisassociateRouteTableCommand(params as any));
      case 'CreateLaunchTemplate':
        return await client.send(new CreateLaunchTemplateCommand(params as any));
      case 'DeleteLaunchTemplate':
        return await client.send(new DeleteLaunchTemplateCommand(params as any));
      case 'AllocateAddress':
        return await client.send(new AllocateAddressCommand(params as any));
      case 'ReleaseAddress':
        return await client.send(new ReleaseAddressCommand(params as any));
      case 'AssociateAddress':
        return await client.send(new AssociateAddressCommand(params as any));
      case 'DisassociateAddress':
        return await client.send(new DisassociateAddressCommand(params as any));
      default:
        throw new Error(`Unsupported command: ${command}`);
    }
  }
}

