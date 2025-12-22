import { BaseTool, BaseToolInput } from '../common/BaseTool';
import { ClientManager } from '../common/ClientManager';
import { AIHandler } from '../chat/AIHandler';
import {
  EMRClient,
  DescribeClusterCommand,
  DescribeJobFlowsCommand,
  DescribeNotebookExecutionCommand,
  DescribePersistentAppUICommand,
  DescribeReleaseLabelCommand,
  DescribeSecurityConfigurationCommand,
  DescribeStepCommand,
  DescribeStudioCommand,
  GetAutoTerminationPolicyCommand,
  GetBlockPublicAccessConfigurationCommand,
  GetClusterSessionCredentialsCommand,
  GetManagedScalingPolicyCommand,
  GetOnClusterAppUIPresignedURLCommand,
  GetPersistentAppUIPresignedURLCommand,
  GetStudioSessionMappingCommand,
  ListBootstrapActionsCommand,
  ListClustersCommand,
  ListInstanceFleetsCommand,
  ListInstanceGroupsCommand,
  ListInstancesCommand,
  ListNotebookExecutionsCommand,
  ListReleaseLabelsCommand,
  ListSecurityConfigurationsCommand,
  ListStepsCommand,
  ListStudiosCommand,
  ListStudioSessionMappingsCommand,
  ListSupportedInstanceTypesCommand
} from '@aws-sdk/client-emr';

// Supported EMR commands
export type EMRCommand =
  | 'DescribeCluster'
  | 'DescribeJobFlows'
  | 'DescribeNotebookExecution'
  | 'DescribePersistentAppUI'
  | 'DescribeReleaseLabel'
  | 'DescribeSecurityConfiguration'
  | 'DescribeStep'
  | 'DescribeStudio'
  | 'GetAutoTerminationPolicy'
  | 'GetBlockPublicAccessConfiguration'
  | 'GetClusterSessionCredentials'
  | 'GetManagedScalingPolicy'
  | 'GetOnClusterAppUIPresignedURL'
  | 'GetPersistentAppUIPresignedURL'
  | 'GetStudioSessionMapping'
  | 'ListBootstrapActions'
  | 'ListClusters'
  | 'ListInstanceFleets'
  | 'ListInstanceGroups'
  | 'ListInstances'
  | 'ListNotebookExecutions'
  | 'ListReleaseLabels'
  | 'ListSecurityConfigurations'
  | 'ListSteps'
  | 'ListStudios'
  | 'ListStudioSessionMappings'
  | 'ListSupportedInstanceTypes';

// Input interface
interface EMRToolInput extends BaseToolInput {
  command: EMRCommand;
}

export class EMRTool extends BaseTool<EMRToolInput> {
  protected readonly toolName = 'EMRTool';

  private async getClient(): Promise<EMRClient> {
    return ClientManager.Instance.getClient('emr', async (session) => {
      const credentials = await session.GetCredentials();
      return new EMRClient({
        credentials,
        endpoint: session.AwsEndPoint,
        region: session.AwsRegion,
      });
    });
  }

  protected updateResourceContext(command: string, params: Record<string, any>): void {
    if ('ClusterId' in params && typeof params.ClusterId === 'string') {
      AIHandler.Current.updateLatestResource({ type: 'EMR Cluster', name: params.ClusterId });
      return;
    }

    if ('StudioId' in params && typeof params.StudioId === 'string') {
      AIHandler.Current.updateLatestResource({ type: 'EMR Studio', name: params.StudioId });
    }
  }

  protected async executeCommand(command: EMRCommand, params: Record<string, any>): Promise<any> {
    const client = await this.getClient();

    switch (command) {
      case 'DescribeCluster':
        return await client.send(new DescribeClusterCommand(params as any));
      case 'DescribeJobFlows':
        return await client.send(new DescribeJobFlowsCommand(params as any));
      case 'DescribeNotebookExecution':
        return await client.send(new DescribeNotebookExecutionCommand(params as any));
      case 'DescribePersistentAppUI':
        return await client.send(new DescribePersistentAppUICommand(params as any));
      case 'DescribeReleaseLabel':
        return await client.send(new DescribeReleaseLabelCommand(params as any));
      case 'DescribeSecurityConfiguration':
        return await client.send(new DescribeSecurityConfigurationCommand(params as any));
      case 'DescribeStep':
        return await client.send(new DescribeStepCommand(params as any));
      case 'DescribeStudio':
        return await client.send(new DescribeStudioCommand(params as any));
      case 'GetAutoTerminationPolicy':
        return await client.send(new GetAutoTerminationPolicyCommand(params as any));
      case 'GetBlockPublicAccessConfiguration':
        return await client.send(new GetBlockPublicAccessConfigurationCommand(params as any));
      case 'GetClusterSessionCredentials':
        return await client.send(new GetClusterSessionCredentialsCommand(params as any));
      case 'GetManagedScalingPolicy':
        return await client.send(new GetManagedScalingPolicyCommand(params as any));
      case 'GetOnClusterAppUIPresignedURL':
        return await client.send(new GetOnClusterAppUIPresignedURLCommand(params as any));
      case 'GetPersistentAppUIPresignedURL':
        return await client.send(new GetPersistentAppUIPresignedURLCommand(params as any));
      case 'GetStudioSessionMapping':
        return await client.send(new GetStudioSessionMappingCommand(params as any));
      case 'ListBootstrapActions':
        return await client.send(new ListBootstrapActionsCommand(params as any));
      case 'ListClusters':
        return await client.send(new ListClustersCommand(params as any));
      case 'ListInstanceFleets':
        return await client.send(new ListInstanceFleetsCommand(params as any));
      case 'ListInstanceGroups':
        return await client.send(new ListInstanceGroupsCommand(params as any));
      case 'ListInstances':
        return await client.send(new ListInstancesCommand(params as any));
      case 'ListNotebookExecutions':
        return await client.send(new ListNotebookExecutionsCommand(params as any));
      case 'ListReleaseLabels':
        return await client.send(new ListReleaseLabelsCommand(params as any));
      case 'ListSecurityConfigurations':
        return await client.send(new ListSecurityConfigurationsCommand(params as any));
      case 'ListSteps':
        return await client.send(new ListStepsCommand(params as any));
      case 'ListStudios':
        return await client.send(new ListStudiosCommand(params as any));
      case 'ListStudioSessionMappings':
        return await client.send(new ListStudioSessionMappingsCommand(params as any));
      case 'ListSupportedInstanceTypes':
        return await client.send(new ListSupportedInstanceTypesCommand(params as any));
      default:
        throw new Error(`Unsupported command: ${command}`);
    }
  }
}
