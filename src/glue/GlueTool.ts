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
  | 'StartJobRun';

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
        return await client.send(new GetTriggersCommand(params as GetTriggersParams));

      case 'ListJobs':
        return await client.send(new ListJobsCommand(params as ListJobsParams));

      case 'ListTriggers':
        return await client.send(new ListTriggersCommand(params as ListTriggersParams));

      case 'StartJobRun':
        return await this.executeStartJobRun(params as StartJobRunParams);

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
