import { BaseTool, BaseToolInput } from '../common/BaseTool';
import { ClientManager } from '../common/ClientManager';
import {
  GlueClient,
  CreateJobCommand,
  GetJobCommand,
  GetJobRunCommand,
  GetJobRunsCommand,
  GetTagsCommand,
  GetTriggerCommand,
  GetTriggersCommand,
  ListJobsCommand,
  ListTriggersCommand,
  StartJobRunCommand,
  GetDatabasesCommand,
  GetDatabaseCommand,
  GetTablesCommand,
  GetTableCommand,
  GetPartitionsCommand,
  GetCrawlerCommand,
  GetCrawlersCommand,
  ListCrawlersCommand,
  ListCrawlsCommand,
  GetConnectionsCommand,
  GetJobBookmarkCommand,
  CreateDatabaseCommand,
  CreateTableCommand,
  CreatePartitionCommand,
  CreateCrawlerCommand,
  StartCrawlerCommand,
  CreateTriggerCommand,
  CreateConnectionCommand,
  CreateDevEndpointCommand,
  CreateWorkflowCommand,
  CreateSecurityConfigurationCommand,
  UpdateJobCommand,
  UpdateCrawlerCommand,
  UpdateTriggerCommand,
  TagResourceCommand,
  UntagResourceCommand,
  DeleteJobCommand,
  DeleteCrawlerCommand,
  DeleteDatabaseCommand,
  DeleteTableCommand,
  DeletePartitionCommand,
  DeleteConnectionCommand,
  DeleteDevEndpointCommand,
  DeleteWorkflowCommand,
  DeleteSecurityConfigurationCommand,
  DeleteTriggerCommand,
  StopCrawlerCommand,
  BatchStopJobRunCommand,
} from '@aws-sdk/client-glue';
import { AIHandler } from '../chat/AIHandler';

// Command type definition
type GlueCommand =
  | 'CreateJob'
  | 'GetJob'
  | 'GetJobRun'
  | 'GetJobRuns'
  | 'GetTags'
  | 'GetTrigger'
  | 'GetTriggers'
  | 'ListJobs'
  | 'ListTriggers'
  | 'StartJobRun'
  | 'GetDatabases'
  | 'GetDatabase'
  | 'GetTables'
  | 'GetTable'
  | 'GetPartitions'
  | 'GetCrawler'
  | 'GetCrawlers'
  | 'ListCrawlers'
  | 'ListCrawls'
  | 'GetConnections'
  | 'GetJobBookmark'
  | 'CreateDatabase'
  | 'CreateTable'
  | 'CreatePartition'
  | 'CreateCrawler'
  | 'StartCrawler'
  | 'CreateTrigger'
  | 'CreateConnection'
  | 'CreateDevEndpoint'
  | 'CreateWorkflow'
  | 'CreateSecurityConfiguration'
  | 'UpdateJob'
  | 'UpdateCrawler'
  | 'UpdateTrigger'
  | 'TagResource'
  | 'UntagResource'
  | 'DeleteJob'
  | 'DeleteCrawler'
  | 'DeleteDatabase'
  | 'DeleteTable'
  | 'DeletePartition'
  | 'DeleteConnection'
  | 'DeleteDevEndpoint'
  | 'DeleteWorkflow'
  | 'DeleteSecurityConfiguration'
  | 'DeleteTrigger'
  | 'StopCrawler'
  | 'BatchStopJobRun';

// Input interface - command + params object
interface GlueToolInput extends BaseToolInput {
  command: GlueCommand;
}

// Command parameter interfaces for type safety
interface CreateJobParams {
  Name: string;
  Role: string;
  Command: any;
  Description?: string;
  LogUri?: string;
  DefaultArguments?: Record<string, string>;
  Connections?: any;
  MaxRetries?: number;
  Timeout?: number;
  MaxCapacity?: number;
  WorkerType?: 'Standard' | 'G.1X' | 'G.2X' | 'G.025X';
  NumberOfWorkers?: number;
  Tags?: Record<string, string>;
}

interface GetJobParams {
  JobName: string;
}

interface GetJobRunParams {
  JobName: string;
  RunId: string;
}

interface GetJobRunsParams {
  JobName: string;
  nextToken?: string;
  MaxResults?: number;
}

interface GetTagsParams {
  ResourceArn: string;
}

interface GetTriggerParams {
  Name: string;
}

interface GetTriggersParams {
  nextToken?: string;
  MaxResults?: number;
  DependencyJobName?: string;
}

interface ListJobsParams {
  nextToken?: string;
  MaxResults?: number;
}

interface ListTriggersParams {
  nextToken?: string;
  MaxResults?: number;
  DependentJobName?: string;
}

interface StartJobRunParams {
  JobName: string;
  JobRunId?: string;
  Arguments?: Record<string, string>;
  AllocatedCapacity?: number;
  MaxCapacity?: number;
  Timeout?: number;
  SecurityConfiguration?: string;
}

export class GlueTool extends BaseTool<GlueToolInput> {
  protected readonly toolName = 'GlueTool';

  private async getClient(): Promise<GlueClient> {
      return ClientManager.Instance.getClient('glue', async (session) => {
      const credentials = await session.GetCredentials();
      return new GlueClient({
        credentials,
        endpoint: session.AwsEndPoint,
        region: session.AwsRegion,
      });
    });
  }

  protected updateResourceContext(command: string, params: Record<string, any>): void {
     if ("JobName" in params) {
      AIHandler.Current.updateLatestResource({ type: "Glue Job", name: params["JobName"] });
    }
  }

  protected async executeCommand(command: GlueCommand, params: Record<string, any>): Promise<any> {
    const client = await this.getClient();

    switch (command) {
      case 'CreateJob':
        return await client.send(new CreateJobCommand(params as CreateJobParams));

      case 'GetJob':
        return await client.send(new GetJobCommand(params as GetJobParams));

      case 'GetJobRun':
        return await this.executeGetJobRun(params as GetJobRunParams);

      case 'GetJobRuns':
        return await client.send(new GetJobRunsCommand(params as GetJobRunsParams));

      case 'GetTags':
        return await client.send(new GetTagsCommand(params as GetTagsParams));

      case 'GetTrigger':
        return await client.send(new GetTriggerCommand(params as GetTriggerParams));

      case 'GetTriggers':
      case 'GetDatabases':
        return await client.send(new GetDatabasesCommand(params as any));

      case 'GetDatabase':
        return await client.send(new GetDatabaseCommand(params as any));

      case 'GetTables':
        return await client.send(new GetTablesCommand(params as any));

      case 'GetTable':
        return await client.send(new GetTableCommand(params as any));

      case 'GetPartitions':
        return await client.send(new GetPartitionsCommand(params as any));

      case 'GetCrawler':
        return await client.send(new GetCrawlerCommand(params as any));

      case 'GetCrawlers':
        return await client.send(new GetCrawlersCommand(params as any));

      case 'ListCrawlers':
        return await client.send(new ListCrawlersCommand(params as any));

      case 'ListCrawls':
        return await client.send(new ListCrawlsCommand(params as any));

      case 'GetConnections':
        return await client.send(new GetConnectionsCommand(params as any));

      case 'GetJobBookmark':
        return await client.send(new GetJobBookmarkCommand(params as any));

        return await client.send(new GetTriggersCommand(params as GetTriggersParams));

      case 'ListJobs':
        return await client.send(new ListJobsCommand(params as ListJobsParams));

      case 'ListTriggers':
        return await client.send(new ListTriggersCommand(params as ListTriggersParams));

      case 'StartJobRun':
        return await this.executeStartJobRun(params as StartJobRunParams);

      case 'CreateDatabase':
        return await client.send(new CreateDatabaseCommand(params as any));

      case 'CreateTable':
        return await client.send(new CreateTableCommand(params as any));

      case 'CreatePartition':
        return await client.send(new CreatePartitionCommand(params as any));

      case 'CreateCrawler':
        return await client.send(new CreateCrawlerCommand(params as any));

      case 'StartCrawler':
        return await client.send(new StartCrawlerCommand(params as any));

      case 'CreateTrigger':
        return await client.send(new CreateTriggerCommand(params as any));

      case 'CreateConnection':
        return await client.send(new CreateConnectionCommand(params as any));

      case 'CreateDevEndpoint':
        return await client.send(new CreateDevEndpointCommand(params as any));

      case 'CreateWorkflow':
        return await client.send(new CreateWorkflowCommand(params as any));

      case 'CreateSecurityConfiguration':
        return await client.send(new CreateSecurityConfigurationCommand(params as any));

      case 'UpdateJob':
        return await client.send(new UpdateJobCommand(params as any));

      case 'UpdateCrawler':
        return await client.send(new UpdateCrawlerCommand(params as any));

      case 'UpdateTrigger':
        return await client.send(new UpdateTriggerCommand(params as any));

      case 'TagResource':
        return await client.send(new TagResourceCommand(params as any));

      case 'UntagResource':
        return await client.send(new UntagResourceCommand(params as any));

      case 'DeleteJob':
        return await client.send(new DeleteJobCommand(params as any));

      case 'DeleteCrawler':
        return await client.send(new DeleteCrawlerCommand(params as any));

      case 'DeleteDatabase':
        return await client.send(new DeleteDatabaseCommand(params as any));

      case 'DeleteTable':
        return await client.send(new DeleteTableCommand(params as any));

      case 'DeletePartition':
        return await client.send(new DeletePartitionCommand(params as any));

      case 'DeleteConnection':
        return await client.send(new DeleteConnectionCommand(params as any));

      case 'DeleteDevEndpoint':
        return await client.send(new DeleteDevEndpointCommand(params as any));

      case 'DeleteWorkflow':
        return await client.send(new DeleteWorkflowCommand(params as any));

      case 'DeleteSecurityConfiguration':
        return await client.send(new DeleteSecurityConfigurationCommand(params as any));

      case 'DeleteTrigger':
        return await client.send(new DeleteTriggerCommand(params as any));

      case 'StopCrawler':
        return await client.send(new StopCrawlerCommand(params as any));

      case 'BatchStopJobRun':
        return await client.send(new BatchStopJobRunCommand(params as any));

      default:
        throw new Error(`Unsupported command: ${command}`);
    }
  }

  private async executeGetJobRun(params: GetJobRunParams): Promise<any> {
    const client = await this.getClient();
    const command = new GetJobRunCommand(params);
    const result = await client.send(command);
    
    // Extract LogGroup and LogStream from Glue job run
    if (result.JobRun?.LogGroupName) {
      AIHandler.Current.updateLatestResource({ 
        type: 'CloudWatch Log Group', 
        name: result.JobRun.LogGroupName 
      });
      
      // Store log stream if available (typically job run ID)
      if (result.JobRun.Id) {
        const logStreamName = result.JobRun.Id;
        AIHandler.Current.updateLatestResource({ 
          type: 'CloudWatch Log Stream', 
          name: logStreamName 
        });
      }
    }

    // Track the Glue Job Run ID for later reference
    if (result.JobRun?.Id) {
      AIHandler.Current.updateLatestResource({
        type: 'Glue Job Run',
        name: result.JobRun.Id
      });
    }
    return result;
  }

  private async executeStartJobRun(params: StartJobRunParams): Promise<any> {
    const client = await this.getClient();
    const command = new StartJobRunCommand(params);
    const result = await client.send(command);
    
    // For started job runs, construct the log group name (standard Glue pattern)
    // Glue job logs typically go to /aws-glue/jobs/output and /aws-glue/jobs/error
    if (params.JobName) {
      const logGroupName = `/aws-glue/jobs/output`;
      AIHandler.Current.updateLatestResource({ 
        type: 'CloudWatch Log Group', 
        name: logGroupName 
      });
      
      // Store log stream if job run ID is returned
      if (result.JobRunId) {
        AIHandler.Current.updateLatestResource({ 
          type: 'CloudWatch Log Stream', 
          name: result.JobRunId 
        });
      }
    }

    // Track the Glue Job Run ID for later reference
    if (result.JobRunId) {
      AIHandler.Current.updateLatestResource({
        type: 'Glue Job Run',
        name: result.JobRunId
      });
    }
    return result;
  }
}
