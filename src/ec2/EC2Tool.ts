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
  | 'GetPasswordData';

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
      default:
        throw new Error(`Unsupported command: ${command}`);
    }
  }
}

