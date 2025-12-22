import { BaseTool, BaseToolInput } from '../common/BaseTool';
import { ClientManager } from '../common/ClientManager';
import {
  DynamoDBClient,
  ListTablesCommand,
  DescribeTableCommand,
  CreateTableCommand,
  DeleteTableCommand,
  QueryCommand,
  ScanCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  GetItemCommand,
  UpdateTableCommand,
  UpdateTimeToLiveCommand,
  ListTagsOfResourceCommand,
} from '@aws-sdk/client-dynamodb';
import { AIHandler } from '../chat/AIHandler';

// Command type definition
type DynamoDBCommand =
  | 'ListTables'
  | 'DescribeTable'
  | 'CreateTable'
  | 'DeleteTable'
  | 'Query'
  | 'Scan'
  | 'PutItem'
  | 'UpdateItem'
  | 'DeleteItem'
  | 'GetItem'
  | 'UpdateTable'
  | 'UpdateTimeToLive'
  | 'ListTagsOfResource';

// Input interface - command + params object
interface DynamoDBToolInput extends BaseToolInput {
  command: DynamoDBCommand;
}

export class DynamoDBTool extends BaseTool<DynamoDBToolInput> {
  protected readonly toolName = 'DynamoDBTool';

  private async getClient(): Promise<DynamoDBClient> {
      return ClientManager.Instance.getClient('dynamodb', async (session) => {
      const credentials = await session.GetCredentials();
      return new DynamoDBClient({
        credentials,
        endpoint: session.AwsEndPoint,
        region: session.AwsRegion,
      });
    });
  }

  protected updateResourceContext(command: string, params: Record<string, any>): void {
    if ("TableName" in params) {
      AIHandler.Current.updateLatestResource({ type: "DynamoDB Table", name: params["TableName"] });
    }
  }

  protected async executeCommand(command: DynamoDBCommand, params: Record<string, any>): Promise<any> {
    const client = await this.getClient();

    switch (command) {
      case 'ListTables':
        return await client.send(new ListTablesCommand(params as any));

      case 'DescribeTable':
        return await client.send(new DescribeTableCommand(params as any));

      case 'CreateTable':
        return await client.send(new CreateTableCommand(params as any));

      case 'DeleteTable':
        return await client.send(new DeleteTableCommand(params as any));

      case 'Query':
        return await client.send(new QueryCommand(params as any));

      case 'Scan':
        return await client.send(new ScanCommand(params as any));

      case 'PutItem':
        return await client.send(new PutItemCommand(params as any));

      case 'UpdateItem':
        return await client.send(new UpdateItemCommand(params as any));

      case 'DeleteItem':
        return await client.send(new DeleteItemCommand(params as any));

      case 'GetItem':
        return await client.send(new GetItemCommand(params as any));

      case 'UpdateTable':
        return await client.send(new UpdateTableCommand(params as any));

      case 'UpdateTimeToLive':
        return await client.send(new UpdateTimeToLiveCommand(params as any));

      case 'ListTagsOfResource':
        return await client.send(new ListTagsOfResourceCommand(params as any));

      default:
        throw new Error(`Unsupported command: ${command}`);
    }
  }
}
