import { BaseTool, BaseToolInput } from '../common/BaseTool';
import { ClientManager } from '../common/ClientManager';
import {
  SFNClient,
  DescribeExecutionCommand,
  DescribeStateMachineCommand,
  ListExecutionsCommand,
  ListStateMachinesCommand,
  StartExecutionCommand,
  GetExecutionHistoryCommand,
  UpdateStateMachineCommand,
  ValidateStateMachineDefinitionCommand,
  DescribeActivityCommand,
  ListActivitiesCommand,
  DescribeMapRunCommand,
  ListMapRunsCommand,
  DescribeStateMachineForExecutionCommand,
  DescribeStateMachineAliasCommand,
  ListStateMachineAliasesCommand,
  ListStateMachineVersionsCommand,
} from '@aws-sdk/client-sfn';
import { AIHandler } from '../chat/AIHandler';

// Command type definition
type StepFuncCommand =
  | 'DescribeExecution'
  | 'DescribeStateMachine'
  | 'ListExecutions'
  | 'ListStateMachines'
  | 'StartExecution'
  | 'GetExecutionHistory'
  | 'UpdateStateMachine'
  | 'ValidateStateMachineDefinition'
  | 'DescribeActivity'
  | 'ListActivities'
  | 'DescribeMapRun'
  | 'ListMapRuns'
  | 'DescribeStateMachineForExecution'
  | 'DescribeStateMachineAlias'
  | 'ListStateMachineAliases'
  | 'ListStateMachineVersions';

// Input interface - command + params object
interface StepFuncToolInput extends BaseToolInput {
  command: StepFuncCommand;
}

// Command parameter interfaces for type safety
interface DescribeExecutionParams {
  executionArn: string;
}

interface DescribeStateMachineParams {
  stateMachineArn: string;
}

interface ListExecutionsParams {
  stateMachineArn?: string;
  maxResults?: number;
  nextToken?: string;
  statusFilter?: 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'TIMED_OUT' | 'ABORTED';
}

interface ListStateMachinesParams {
  maxResults?: number;
  nextToken?: string;
}

interface StartExecutionParams {
  stateMachineArn: string;
  name?: string;
  input?: string | Record<string, any>;
  traceHeader?: string;
}

interface UpdateStateMachineParams {
  stateMachineArn: string;
  definition?: string;
  roleArn?: string;
  loggingConfiguration?: any;
  tracingConfiguration?: any;
  publish?: boolean;
  versionDescription?: string;
}

interface GetExecutionHistoryParams {
  executionArn: string;
  maxResults?: number;
  reverseOrder?: boolean;
  nextToken?: string;
}

export class StepFuncTool extends BaseTool<StepFuncToolInput> {
  protected readonly toolName = 'StepFuncTool';

  private async getClient(): Promise<SFNClient> {
      return ClientManager.Instance.getClient('sfn', async (session) => {
      const credentials = await session.GetCredentials();
      return new SFNClient({
        credentials,
        endpoint: session.AwsEndPoint,
        region: session.AwsRegion,
      });
    });
  }

  protected updateResourceContext(command: string, params: Record<string, any>): void {
    if ("stateMachineArn" in params) {
        AIHandler.Current.updateLatestResource({ type: 'Step Function State Machine', name: params.stateMachineArn });
    }
    if ("executionArn" in params) {
        AIHandler.Current.updateLatestResource({ type: 'Step Function Execution', name: params.executionArn });
    }
  }

  protected async executeCommand(command: StepFuncCommand, params: Record<string, any>): Promise<any> {
    const client = await this.getClient();

    switch (command) {
      case 'DescribeExecution':
        return await client.send(new DescribeExecutionCommand(params as DescribeExecutionParams));

      case 'DescribeStateMachine':
        return await client.send(new DescribeStateMachineCommand(params as DescribeStateMachineParams));

      case 'ListExecutions':
        return await client.send(new ListExecutionsCommand(params as ListExecutionsParams));

      case 'ListStateMachines':
        return await client.send(new ListStateMachinesCommand(params as ListStateMachinesParams));

      case 'StartExecution':
        return await this.executeStartExecution(params as StartExecutionParams);

      case 'GetExecutionHistory':
        return await client.send(new GetExecutionHistoryCommand(params as GetExecutionHistoryParams));

      case 'UpdateStateMachine':
        return await client.send(new UpdateStateMachineCommand(params as UpdateStateMachineParams));

      case 'ValidateStateMachineDefinition':
        return await client.send(new ValidateStateMachineDefinitionCommand(params as any));

      case 'DescribeActivity':
        return await client.send(new DescribeActivityCommand(params as any));

      case 'ListActivities':
        return await client.send(new ListActivitiesCommand(params as any));

      case 'DescribeMapRun':
        return await client.send(new DescribeMapRunCommand(params as any));

      case 'ListMapRuns':
        return await client.send(new ListMapRunsCommand(params as any));

      case 'DescribeStateMachineForExecution':
        return await client.send(new DescribeStateMachineForExecutionCommand(params as any));

      case 'DescribeStateMachineAlias':
        return await client.send(new DescribeStateMachineAliasCommand(params as any));

      case 'ListStateMachineAliases':
        return await client.send(new ListStateMachineAliasesCommand(params as any));

      case 'ListStateMachineVersions':
        return await client.send(new ListStateMachineVersionsCommand(params as any));

      default:
        throw new Error(`Unsupported command: ${command}`);
    }
  }
  
  private async executeStartExecution(params: StartExecutionParams): Promise<any> {
    const client = await this.getClient();
    const commandParams: any = { ...params };

    // Convert input object to string if necessary
    if (commandParams.input && typeof commandParams.input !== 'string') {
      commandParams.input = JSON.stringify(commandParams.input);
    }

    const command = new StartExecutionCommand(commandParams);
    return await client.send(command);
  }
}
