import { BaseTool, BaseToolInput } from '../common/BaseTool';
import { ClientManager } from '../common/ClientManager';
import {
  RDSDataClient,
  BatchExecuteStatementCommand,
  BeginTransactionCommand,
  CommitTransactionCommand,
  ExecuteStatementCommand,
  RollbackTransactionCommand,
} from '@aws-sdk/client-rds-data';
import { AIHandler } from '../chat/AIHandler';

type RDSDataCommand =
  | 'BatchExecuteStatement'
  | 'BeginTransaction'
  | 'CommitTransaction'
  | 'ExecuteStatement'
  | 'RollbackTransaction';

interface RDSDataToolInput extends BaseToolInput {
  command: RDSDataCommand;
}

export class RDSDataTool extends BaseTool<RDSDataToolInput> {
  protected readonly toolName = 'RDSDataTool';

  private async getClient(): Promise<RDSDataClient> {
      return ClientManager.Instance.getClient('rds-data', async (session) => {
      const credentials = await session.GetCredentials();
      return new RDSDataClient({
        credentials,
        endpoint: session.AwsEndPoint,
        region: session.AwsRegion,
      });
    });
  }

  protected updateResourceContext(command: string, params: Record<string, any>): void {
     if (params?.database) {
      AIHandler.Current.updateLatestResource({ type: 'RDS Data database', name: params.database });
    }
  }

  protected async executeCommand(command: RDSDataCommand, params: Record<string, any>): Promise<any> {
    const client = await this.getClient();

    switch (command) {
      case 'BatchExecuteStatement': return await client.send(new BatchExecuteStatementCommand(params as any));
      case 'BeginTransaction': return await client.send(new BeginTransactionCommand(params as any));
      case 'CommitTransaction': return await client.send(new CommitTransactionCommand(params as any));
      case 'ExecuteStatement': return await client.send(new ExecuteStatementCommand(params as any));
      case 'RollbackTransaction': return await client.send(new RollbackTransactionCommand(params as any));
      default:
        throw new Error(`Unsupported command: ${command}`);
    }
  }
}

