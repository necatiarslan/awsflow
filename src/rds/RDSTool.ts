import { BaseTool, BaseToolInput } from '../common/BaseTool';
import { ClientManager } from '../common/ClientManager';
import {
  RDSClient,
  DescribeAccountAttributesCommand,
  DescribeBlueGreenDeploymentsCommand,
  DescribeCertificatesCommand,
  DescribeDBClusterAutomatedBackupsCommand,
  DescribeDBClusterParameterGroupsCommand,
  DescribeDBClustersCommand,
  DescribeDBClusterSnapshotsCommand,
  DescribeDBEngineVersionsCommand,
  DescribeDBInstanceAutomatedBackupsCommand,
  DescribeDBInstancesCommand,
  DescribeDBLogFilesCommand,
  DescribeDBParameterGroupsCommand,
  DescribeDBProxiesCommand,
  DescribeDBProxyEndpointsCommand,
  DescribeDBRecommendationsCommand,
  DescribeDBSecurityGroupsCommand,
  DescribeDBSnapshotAttributesCommand,
  DescribeDBSnapshotsCommand,
  DescribeDBSubnetGroupsCommand,
  DescribeEngineDefaultParametersCommand,
  DescribeEventsCommand,
  DescribeEventSubscriptionsCommand,
  DescribeExportTasksCommand,
  DescribeGlobalClustersCommand,
  DescribeIntegrationsCommand,
  DescribeOptionGroupsCommand,
  DescribeOrderableDBInstanceOptionsCommand,
  DescribePendingMaintenanceActionsCommand,
  DescribeReservedDBInstancesCommand,
  DescribeReservedDBInstancesOfferingsCommand,
  DescribeSourceRegionsCommand,
  DescribeTenantDatabasesCommand,
  DescribeValidDBInstanceModificationsCommand,
  DownloadDBLogFilePortionCommand,
  ListTagsForResourceCommand,
} from '@aws-sdk/client-rds';
import { AIHandler } from '../chat/AIHandler';

type RDSCommand =
  | 'DescribeAccountAttributes'
  | 'DescribeBlueGreenDeployments'
  | 'DescribeCertificates'
  | 'DescribeDBClusterAutomatedBackups'
  | 'DescribeDBClusterParameterGroups'
  | 'DescribeDBClusters'
  | 'DescribeDBClusterSnapshots'
  | 'DescribeDBEngineVersions'
  | 'DescribeDBInstanceAutomatedBackups'
  | 'DescribeDBInstances'
  | 'DescribeDBLogFiles'
  | 'DescribeDBParameterGroups'
  | 'DescribeDBProxies'
  | 'DescribeDBProxyEndpoints'
  | 'DescribeDBRecommendations'
  | 'DescribeDBSecurityGroups'
  | 'DescribeDBSnapshotAttributes'
  | 'DescribeDBSnapshots'
  | 'DescribeDBSubnetGroups'
  | 'DescribeEngineDefaultParameters'
  | 'DescribeEvents'
  | 'DescribeEventSubscriptions'
  | 'DescribeExportTasks'
  | 'DescribeGlobalClusters'
  | 'DescribeIntegrations'
  | 'DescribeOptionGroups'
  | 'DescribeOrderableDBInstanceOptions'
  | 'DescribePendingMaintenanceActions'
  | 'DescribeReservedDBInstances'
  | 'DescribeReservedDBInstancesOfferings'
  | 'DescribeSourceRegions'
  | 'DescribeTenantDatabases'
  | 'DescribeValidDBInstanceModifications'
  | 'DownloadDBLogFilePortion'
  | 'ListTagsForResource';

interface RDSToolInput extends BaseToolInput {
  command: RDSCommand;
}

export class RDSTool extends BaseTool<RDSToolInput> {
  protected readonly toolName = 'RDSTool';

  private async getClient(): Promise<RDSClient> {
      return ClientManager.Instance.getClient('rds', async (session) => {
      const credentials = await session.GetCredentials();
      return new RDSClient({
        credentials,
        endpoint: session.AwsEndPoint,
        region: session.AwsRegion,
      });
    });
  }

  protected updateResourceContext(command: string, params: Record<string, any>): void {
     if (params?.DBInstanceIdentifier) {
      AIHandler.Current.updateLatestResource({ type: 'RDS DB Instance', name: params.DBInstanceIdentifier });
    }
  }

  protected async executeCommand(command: RDSCommand, params: Record<string, any>): Promise<any> {
    const client = await this.getClient();

    switch (command) {
      case 'DescribeAccountAttributes': return await client.send(new DescribeAccountAttributesCommand(params));
      case 'DescribeBlueGreenDeployments': return await client.send(new DescribeBlueGreenDeploymentsCommand(params));
      case 'DescribeCertificates': return await client.send(new DescribeCertificatesCommand(params));
      
      case 'DescribeDBClusterAutomatedBackups': return await client.send(new DescribeDBClusterAutomatedBackupsCommand(params));
      case 'DescribeDBClusterParameterGroups': return await client.send(new DescribeDBClusterParameterGroupsCommand(params));
      case 'DescribeDBClusters': return await client.send(new DescribeDBClustersCommand(params));
      case 'DescribeDBClusterSnapshots': return await client.send(new DescribeDBClusterSnapshotsCommand(params));
      case 'DescribeDBEngineVersions': return await client.send(new DescribeDBEngineVersionsCommand(params));
      case 'DescribeDBInstanceAutomatedBackups': return await client.send(new DescribeDBInstanceAutomatedBackupsCommand(params));
      case 'DescribeDBInstances': return await client.send(new DescribeDBInstancesCommand(params));
      case 'DescribeDBLogFiles': return await client.send(new DescribeDBLogFilesCommand(params as any));
      case 'DescribeDBParameterGroups': return await client.send(new DescribeDBParameterGroupsCommand(params));
      case 'DescribeDBProxies': return await client.send(new DescribeDBProxiesCommand(params));
      case 'DescribeDBProxyEndpoints': return await client.send(new DescribeDBProxyEndpointsCommand(params));
      case 'DescribeDBRecommendations': return await client.send(new DescribeDBRecommendationsCommand(params));
      case 'DescribeDBSecurityGroups': return await client.send(new DescribeDBSecurityGroupsCommand(params));
      case 'DescribeDBSnapshotAttributes': return await client.send(new DescribeDBSnapshotAttributesCommand(params as any));
      case 'DescribeDBSnapshots': return await client.send(new DescribeDBSnapshotsCommand(params));
      case 'DescribeDBSubnetGroups': return await client.send(new DescribeDBSubnetGroupsCommand(params));
      case 'DescribeEngineDefaultParameters': return await client.send(new DescribeEngineDefaultParametersCommand(params as any));
      case 'DescribeEvents': return await client.send(new DescribeEventsCommand(params));
      case 'DescribeEventSubscriptions': return await client.send(new DescribeEventSubscriptionsCommand(params));
      case 'DescribeExportTasks': return await client.send(new DescribeExportTasksCommand(params));
      case 'DescribeGlobalClusters': return await client.send(new DescribeGlobalClustersCommand(params));
      
      case 'DescribeIntegrations': return await client.send(new DescribeIntegrationsCommand(params));
      case 'DescribeOptionGroups': return await client.send(new DescribeOptionGroupsCommand(params));
      case 'DescribeOrderableDBInstanceOptions': return await client.send(new DescribeOrderableDBInstanceOptionsCommand(params as any));
      case 'DescribePendingMaintenanceActions': return await client.send(new DescribePendingMaintenanceActionsCommand(params));
      case 'DescribeReservedDBInstances': return await client.send(new DescribeReservedDBInstancesCommand(params));
      case 'DescribeReservedDBInstancesOfferings': return await client.send(new DescribeReservedDBInstancesOfferingsCommand(params));
      case 'DescribeSourceRegions': return await client.send(new DescribeSourceRegionsCommand(params));
      case 'DescribeTenantDatabases': return await client.send(new DescribeTenantDatabasesCommand(params));
      case 'DescribeValidDBInstanceModifications': return await client.send(new DescribeValidDBInstanceModificationsCommand(params as any));
      case 'DownloadDBLogFilePortion': return await client.send(new DownloadDBLogFilePortionCommand(params as any));
      case 'ListTagsForResource': return await client.send(new ListTagsForResourceCommand(params as any));
      default:
        throw new Error(`Unsupported command: ${command}`);
    }
  }
}
