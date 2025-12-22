import { BaseTool, BaseToolInput } from '../common/BaseTool';
import { ClientManager } from '../common/ClientManager';
import {
  SFNClient,
  DescribeExecutionCommand,
  DescribeStateMachineCommand,
  ListExecutionsCommand,
  ListStateMachinesCommand,
  StartExecutionCommand,
  UpdateStateMachineCommand,
} from '@aws-sdk/client-sfn';
import { AIHandler } from '../chat/AIHandler';

// Command type definition
type StepFuncCommand =
  | 'DescribeExecution'
  | 'DescribeStateMachine'
  | 'ListExecutions'
  | 'ListStateMachines'
  | 'StartExecution'
  | 'UpdateStateMachine';

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

      case 'UpdateStateMachine':
        return await client.send(new UpdateStateMachineCommand(params as UpdateStateMachineParams));

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
