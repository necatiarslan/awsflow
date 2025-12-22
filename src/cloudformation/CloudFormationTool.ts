import { BaseTool, BaseToolInput } from '../common/BaseTool';
import { ClientManager } from '../common/ClientManager';
import {
  CloudFormationClient,
  BatchDescribeTypeConfigurationsCommand,
  DescribeAccountLimitsCommand,
  DescribeChangeSetCommand,
  DescribeChangeSetHooksCommand,
  DescribeOrganizationsAccessCommand,
  DescribePublisherCommand,
  DescribeStackDriftDetectionStatusCommand,
  DescribeStackEventsCommand,
  DescribeStackInstanceCommand,
  DescribeStackResourceCommand,
  DescribeStackResourceDriftsCommand,
  DescribeStackResourcesCommand,
  DescribeStacksCommand,
  DescribeStackSetCommand,
  DescribeStackSetOperationCommand,
  DescribeTypeCommand,
  DescribeTypeRegistrationCommand,
  DetectStackDriftCommand,
  DetectStackResourceDriftCommand,
  DetectStackSetDriftCommand,
  GetStackPolicyCommand,
  GetTemplateCommand,
  GetTemplateSummaryCommand,
  ListChangeSetsCommand,
  ListExportsCommand,
  ListImportsCommand,
  ListStackInstanceResourceDriftsCommand,
  ListStackInstancesCommand,
  ListStackResourcesCommand,
  ListStacksCommand,
  ListStackSetOperationResultsCommand,
  ListStackSetOperationsCommand,
  ListStackSetsCommand,
  ListTypeRegistrationsCommand,
  ListTypesCommand,
  ListTypeVersionsCommand
} from '@aws-sdk/client-cloudformation';
import { AIHandler } from '../chat/AIHandler';

type CFNCommand =
  | 'BatchDescribeTypeConfigurations'
  | 'DescribeAccountLimits'
  | 'DescribeChangeSet'
  | 'DescribeChangeSetHooks'
  | 'DescribeGeneratedTemplate'
  | 'DescribeOrganizationsAccess'
  | 'DescribePublisher'
  | 'DescribeResourceScan'
  | 'DescribeStackDriftDetectionStatus'
  | 'DescribeStackEvents'
  | 'DescribeStackInstance'
  | 'DescribeStackRefactor'
  | 'DescribeStackResource'
  | 'DescribeStackResourceDrifts'
  | 'DescribeStackResources'
  | 'DescribeStacks'
  | 'DescribeStackSet'
  | 'DescribeStackSetOperation'
  | 'DescribeType'
  | 'DescribeTypeRegistration'
  | 'DetectStackDrift'
  | 'DetectStackResourceDrift'
  | 'DetectStackSetDrift'
  | 'GetGeneratedTemplate'
  | 'GetHookResult'
  | 'GetStackPolicy'
  | 'GetTemplate'
  | 'GetTemplateSummary'
  | 'ListChangeSets'
  | 'ListExports'
  | 'ListGeneratedTemplates'
  | 'ListHookResults'
  | 'ListImports'
  | 'ListResourceScanRelatedResources'
  | 'ListResourceScanResources'
  | 'ListResourceScans'
  | 'ListStackInstanceResourceDrifts'
  | 'ListStackInstances'
  | 'ListStackRefactorActions'
  | 'ListStackRefactors'
  | 'ListStackResources'
  | 'ListStacks'
  | 'ListStackSetAutoDeploymentTargets'
  | 'ListStackSetOperationResults'
  | 'ListStackSetOperations'
  | 'ListStackSets'
  | 'ListTypeRegistrations'
  | 'ListTypes'
  | 'ListTypeVersions';

interface CloudFormationToolInput extends BaseToolInput {
  command: CFNCommand;
}

export class CloudFormationTool extends BaseTool<CloudFormationToolInput> {
  protected readonly toolName = 'CloudFormationTool';

  private async getClient(): Promise<CloudFormationClient> {
      return ClientManager.Instance.getClient('cloudformation', async (session) => {
      const credentials = await session.GetCredentials();
      return new CloudFormationClient({
        credentials,
        endpoint: session.AwsEndPoint,
        region: session.AwsRegion,
      });
    });
  }

  private async send(ctor: new (input: any) => {}, params: Record<string, any>): Promise<any> {
    const client = await this.getClient();
    const command = new (ctor as any)(params as any);
    return await (client as any).send(command);
  }

  private unsupported(command: CFNCommand): never {
    throw new Error(`${command} is not supported in this SDK version`);
  }

  protected updateResourceContext(command: string, params: Record<string, any>): void {
     if (params?.StackName) {
      AIHandler.Current.updateLatestResource({ type: 'CloudFormation Stack', name: params.StackName });
    }
  }

  protected async executeCommand(command: CFNCommand, params: Record<string, any>): Promise<any> {
    switch (command) {
      case 'BatchDescribeTypeConfigurations': return await this.send(BatchDescribeTypeConfigurationsCommand, params);
      case 'DescribeAccountLimits': return await this.send(DescribeAccountLimitsCommand, params);
      case 'DescribeChangeSet': return await this.send(DescribeChangeSetCommand, params);
      case 'DescribeChangeSetHooks': return await this.send(DescribeChangeSetHooksCommand, params);
      case 'DescribeGeneratedTemplate': return this.unsupported(command);
      case 'DescribeOrganizationsAccess': return await this.send(DescribeOrganizationsAccessCommand, params);
      case 'DescribePublisher': return await this.send(DescribePublisherCommand, params);
      case 'DescribeResourceScan': return this.unsupported(command);
      case 'DescribeStackDriftDetectionStatus': return await this.send(DescribeStackDriftDetectionStatusCommand, params);
      case 'DescribeStackEvents': return await this.send(DescribeStackEventsCommand, params);
      case 'DescribeStackInstance': return await this.send(DescribeStackInstanceCommand, params);
      case 'DescribeStackRefactor': return this.unsupported(command);
      case 'DescribeStackResource': return await this.send(DescribeStackResourceCommand, params);
      case 'DescribeStackResourceDrifts': return await this.send(DescribeStackResourceDriftsCommand, params);
      case 'DescribeStackResources': return await this.send(DescribeStackResourcesCommand, params);
      case 'DescribeStacks': return await this.send(DescribeStacksCommand, params);
      case 'DescribeStackSet': return await this.send(DescribeStackSetCommand, params);
      case 'DescribeStackSetOperation': return await this.send(DescribeStackSetOperationCommand, params);
      case 'DescribeType': return await this.send(DescribeTypeCommand, params);
      case 'DescribeTypeRegistration': return await this.send(DescribeTypeRegistrationCommand, params);
      case 'DetectStackDrift': return await this.send(DetectStackDriftCommand, params);
      case 'DetectStackResourceDrift': return await this.send(DetectStackResourceDriftCommand, params);
      case 'DetectStackSetDrift': return await this.send(DetectStackSetDriftCommand, params);
      case 'GetGeneratedTemplate': return this.unsupported(command);
      case 'GetHookResult': return this.unsupported(command);
      case 'GetStackPolicy': return await this.send(GetStackPolicyCommand, params);
      case 'GetTemplate': return await this.send(GetTemplateCommand, params);
      case 'GetTemplateSummary': return await this.send(GetTemplateSummaryCommand, params);
      case 'ListChangeSets': return await this.send(ListChangeSetsCommand, params);
      case 'ListExports': return await this.send(ListExportsCommand, params);
      case 'ListGeneratedTemplates': return this.unsupported(command);
      case 'ListHookResults': return this.unsupported(command);
      case 'ListImports': return await this.send(ListImportsCommand, params);
      case 'ListResourceScanRelatedResources': return this.unsupported(command);
      case 'ListResourceScanResources': return this.unsupported(command);
      case 'ListResourceScans': return this.unsupported(command);
      case 'ListStackInstanceResourceDrifts': return await this.send(ListStackInstanceResourceDriftsCommand, params);
      case 'ListStackInstances': return await this.send(ListStackInstancesCommand, params);
      case 'ListStackRefactorActions': return this.unsupported(command);
      case 'ListStackRefactors': return this.unsupported(command);
      case 'ListStackResources': return await this.send(ListStackResourcesCommand, params);
      case 'ListStacks': return await this.send(ListStacksCommand, params);
      case 'ListStackSetAutoDeploymentTargets': return this.unsupported(command);
      case 'ListStackSetOperationResults': return await this.send(ListStackSetOperationResultsCommand, params);
      case 'ListStackSetOperations': return await this.send(ListStackSetOperationsCommand, params);
      case 'ListStackSets': return await this.send(ListStackSetsCommand, params);
      case 'ListTypeRegistrations': return await this.send(ListTypeRegistrationsCommand, params);
      case 'ListTypes': return await this.send(ListTypesCommand, params);
      case 'ListTypeVersions': return await this.send(ListTypeVersionsCommand, params);
      default:
        throw new Error(`Unsupported command: ${command}`);
    }
  }
}
