import { BaseTool, BaseToolInput } from '../common/BaseTool';
import { ClientManager } from '../common/ClientManager';
import { 
  SQSClient,
  ListQueuesCommand,
  ListDeadLetterSourceQueuesCommand,
  ListQueueTagsCommand,
  GetQueueAttributesCommand,
  GetQueueUrlCommand,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  PurgeQueueCommand,
  ChangeMessageVisibilityCommand,
  SendMessageBatchCommand,
  DeleteMessageBatchCommand,
  ChangeMessageVisibilityBatchCommand,
  QueueAttributeName,
} from '@aws-sdk/client-sqs';
import { AIHandler } from '../chat/AIHandler';

// Command type definition
type SQSCommand = 
  | 'ListQueues'
  | 'ListDeadLetterSourceQueues'
  | 'ListQueueTags'
  | 'GetQueueAttributes'
  | 'GetQueueUrl'
  | 'SendMessage'
  | 'ReceiveMessage'
  | 'DeleteMessage'
  | 'PurgeQueue'
  | 'ChangeMessageVisibility'
  | 'SendMessageBatch'
  | 'DeleteMessageBatch'
  | 'ChangeMessageVisibilityBatch';

// Input interface - command + params object
interface SQSToolInput extends BaseToolInput {
  command: SQSCommand;
}

export class SQSTool extends BaseTool<SQSToolInput> {
  protected readonly toolName = 'SQSTool';

  private async getClient(): Promise<SQSClient> {
      return ClientManager.Instance.getClient('sqs', async (session) => {
      const credentials = await session.GetCredentials();
      return new SQSClient({
        credentials,
        endpoint: session.AwsEndPoint,
        region: session.AwsRegion,
      });
    });
  }

  protected updateResourceContext(command: string, params: Record<string, any>): void {
     if ("QueueUrl" in params) {
      AIHandler.Current.updateLatestResource({ type: "SQS Queue", name: params.QueueUrl });
    } else if ("QueueName" in params) {
      AIHandler.Current.updateLatestResource({ type: "SQS Queue", name: params.QueueName });
    }
  }

  protected async executeCommand(command: SQSCommand, params: Record<string, any>): Promise<any> {
    const client = await this.getClient();

    switch (command) {
      case 'ListQueues':
        return await client.send(new ListQueuesCommand(params as any));
      
      case 'ListDeadLetterSourceQueues':
        return await client.send(new ListDeadLetterSourceQueuesCommand(params as any));
      
      case 'ListQueueTags':
        return await client.send(new ListQueueTagsCommand(params as any));
      
      case 'GetQueueAttributes':
        return await client.send(new GetQueueAttributesCommand(params as any));
      
      case 'GetQueueUrl':
        return await client.send(new GetQueueUrlCommand(params as any));
      
      case 'SendMessage':
        return await client.send(new SendMessageCommand(params as any));
      
      case 'ReceiveMessage':
        return await client.send(new ReceiveMessageCommand(params as any));
      
      case 'DeleteMessage':
        return await client.send(new DeleteMessageCommand(params as any));
      
      case 'PurgeQueue':
        return await client.send(new PurgeQueueCommand(params as any));
      
      case 'ChangeMessageVisibility':
        return await client.send(new ChangeMessageVisibilityCommand(params as any));
      
      case 'SendMessageBatch':
        return await client.send(new SendMessageBatchCommand(params as any));
      
      case 'DeleteMessageBatch':
        return await client.send(new DeleteMessageBatchCommand(params as any));
      
      case 'ChangeMessageVisibilityBatch':
        return await client.send(new ChangeMessageVisibilityBatchCommand(params as any));
      
      default:
        throw new Error(`Unsupported command: ${command}`);
    }
  }
}

