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
  CreateDBInstanceCommand,
  CreateDBClusterCommand,
  CreateDBSnapshotCommand,
  CreateDBClusterSnapshotCommand,
  RestoreDBInstanceFromDBSnapshotCommand,
  RestoreDBClusterFromSnapshotCommand,
  CreateDBParameterGroupCommand,
  CreateDBSubnetGroupCommand,
  CreateDBSecurityGroupCommand,
  CreateDBProxyCommand,
  CreateEventSubscriptionCommand,
  ModifyDBInstanceCommand,
  ModifyDBClusterCommand,
  StartDBInstanceCommand,
  StopDBInstanceCommand,
  RebootDBInstanceCommand,
  AddTagsToResourceCommand,
  RemoveTagsFromResourceCommand,
  DeleteDBInstanceCommand,
  DeleteDBClusterCommand,
  DeleteDBSnapshotCommand,
  DeleteDBClusterSnapshotCommand,
  DeleteDBParameterGroupCommand,
  DeleteDBSubnetGroupCommand,
  DeleteDBSecurityGroupCommand,
  DeleteDBProxyCommand,
  DeleteEventSubscriptionCommand,
  CopyDBSnapshotCommand,
  CopyDBClusterSnapshotCommand,
  PromoteReadReplicaCommand,
  CreateDBInstanceReadReplicaCommand,
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
  | 'ListTagsForResource'
  | 'CreateDBInstance'
  | 'CreateDBCluster'
  | 'CreateDBSnapshot'
  | 'CreateDBClusterSnapshot'
  | 'RestoreDBInstanceFromDBSnapshot'
  | 'RestoreDBClusterFromSnapshot'
  | 'CreateDBParameterGroup'
  | 'CreateDBSubnetGroup'
  | 'CreateDBSecurityGroup'
  | 'CreateDBProxy'
  | 'CreateEventSubscription'
  | 'ModifyDBInstance'
  | 'ModifyDBCluster'
  | 'StartDBInstance'
  | 'StopDBInstance'
  | 'RebootDBInstance'
  | 'AddTagsToResource'
  | 'RemoveTagsFromResource'
  | 'DeleteDBInstance'
  | 'DeleteDBCluster'
  | 'DeleteDBSnapshot'
  | 'DeleteDBClusterSnapshot'
  | 'DeleteDBParameterGroup'
  | 'DeleteDBSubnetGroup'
  | 'DeleteDBSecurityGroup'
  | 'DeleteDBProxy'
  | 'DeleteEventSubscription'
  | 'CopyDBSnapshot'
  | 'CopyDBClusterSnapshot'
  | 'PromoteReadReplica'
  | 'CreateDBInstanceReadReplica';

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
    if (params?.DBClusterIdentifier) {
      AIHandler.Current.updateLatestResource({ type: 'RDS DB Cluster', name: params.DBClusterIdentifier });
    }
    if (params?.DBSnapshotIdentifier) {
      AIHandler.Current.updateLatestResource({ type: 'RDS Snapshot', name: params.DBSnapshotIdentifier });
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
      case 'CreateDBInstance': return await client.send(new CreateDBInstanceCommand(params as any));
      case 'CreateDBCluster': return await client.send(new CreateDBClusterCommand(params as any));
      case 'CreateDBSnapshot': return await client.send(new CreateDBSnapshotCommand(params as any));
      case 'CreateDBClusterSnapshot': return await client.send(new CreateDBClusterSnapshotCommand(params as any));
      case 'RestoreDBInstanceFromDBSnapshot': return await client.send(new RestoreDBInstanceFromDBSnapshotCommand(params as any));
      case 'RestoreDBClusterFromSnapshot': return await client.send(new RestoreDBClusterFromSnapshotCommand(params as any));
      case 'CreateDBParameterGroup': return await client.send(new CreateDBParameterGroupCommand(params as any));
      case 'CreateDBSubnetGroup': return await client.send(new CreateDBSubnetGroupCommand(params as any));
      case 'CreateDBSecurityGroup': return await client.send(new CreateDBSecurityGroupCommand(params as any));
      case 'CreateDBProxy': return await client.send(new CreateDBProxyCommand(params as any));
      case 'CreateEventSubscription': return await client.send(new CreateEventSubscriptionCommand(params as any));
      case 'ModifyDBInstance': return await client.send(new ModifyDBInstanceCommand(params as any));
      case 'ModifyDBCluster': return await client.send(new ModifyDBClusterCommand(params as any));
      case 'StartDBInstance': return await client.send(new StartDBInstanceCommand(params as any));
      case 'StopDBInstance': return await client.send(new StopDBInstanceCommand(params as any));
      case 'RebootDBInstance': return await client.send(new RebootDBInstanceCommand(params as any));
      case 'AddTagsToResource': return await client.send(new AddTagsToResourceCommand(params as any));
      case 'RemoveTagsFromResource': return await client.send(new RemoveTagsFromResourceCommand(params as any));
      case 'DeleteDBInstance': return await client.send(new DeleteDBInstanceCommand(params as any));
      case 'DeleteDBCluster': return await client.send(new DeleteDBClusterCommand(params as any));
      case 'DeleteDBSnapshot': return await client.send(new DeleteDBSnapshotCommand(params as any));
      case 'DeleteDBClusterSnapshot': return await client.send(new DeleteDBClusterSnapshotCommand(params as any));
      case 'DeleteDBParameterGroup': return await client.send(new DeleteDBParameterGroupCommand(params as any));
      case 'DeleteDBSubnetGroup': return await client.send(new DeleteDBSubnetGroupCommand(params as any));
      case 'DeleteDBSecurityGroup': return await client.send(new DeleteDBSecurityGroupCommand(params as any));
      case 'DeleteDBProxy': return await client.send(new DeleteDBProxyCommand(params as any));
      case 'DeleteEventSubscription': return await client.send(new DeleteEventSubscriptionCommand(params as any));
      case 'CopyDBSnapshot': return await client.send(new CopyDBSnapshotCommand(params as any));
      case 'CopyDBClusterSnapshot': return await client.send(new CopyDBClusterSnapshotCommand(params as any));
      case 'PromoteReadReplica': return await client.send(new PromoteReadReplicaCommand(params as any));
      case 'CreateDBInstanceReadReplica': return await client.send(new CreateDBInstanceReadReplicaCommand(params as any));
      default:
        throw new Error(`Unsupported command: ${command}`);
    }
  }
}
