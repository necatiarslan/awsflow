import { BaseTool, BaseToolInput } from '../common/BaseTool';
import { ClientManager } from '../common/ClientManager';
import {
  SNSClient,
  CheckIfPhoneNumberIsOptedOutCommand,
  GetEndpointAttributesCommand,
  GetPlatformApplicationAttributesCommand,
  GetSMSAttributesCommand,
  GetSubscriptionAttributesCommand,
  GetTopicAttributesCommand,
  ListPhoneNumbersOptedOutCommand,
  ListSubscriptionsByTopicCommand,
  ListSubscriptionsCommand,
  ListTagsForResourceCommand,
  ListTopicsCommand,
  PublishCommand,
  GetDataProtectionPolicyCommand,
  GetSMSSandboxAccountStatusCommand,
  ListPlatformApplicationsCommand,
  ListEndpointsByPlatformApplicationCommand,
  ListOriginationNumbersCommand,
  CreateTopicCommand,
  SubscribeCommand,
  UnsubscribeCommand,
  CreatePlatformApplicationCommand,
  CreatePlatformEndpointCommand,
  SetTopicAttributesCommand,
  SetSubscriptionAttributesCommand,
  AddPermissionCommand,
  RemovePermissionCommand,
  TagResourceCommand,
  UntagResourceCommand,
  OptInPhoneNumberCommand,
  DeleteTopicCommand,
  DeletePlatformApplicationCommand,
  DeleteEndpointCommand,
  ConfirmSubscriptionCommand,
} from '@aws-sdk/client-sns';
import { AIHandler } from '../chat/AIHandler';

type SNSCommand =
  | 'CheckIfPhoneNumberIsOptedOut'
  | 'GetEndpointAttributes'
  | 'GetPlatformApplicationAttributes'
  | 'GetSMSAttributes'
  | 'GetSubscriptionAttributes'
  | 'GetTopicAttributes'
  | 'ListPhoneNumbersOptedOut'
  | 'ListSubscriptionsByTopic'
  | 'ListSubscriptions'
  | 'ListTagsForResource'
  | 'ListTopics'
  | 'Publish'
  | 'GetDataProtectionPolicy'
  | 'GetSMSSandboxAccountStatus'
  | 'ListPlatformApplications'
  | 'ListEndpointsByPlatformApplication'
  | 'ListOriginationNumbers'
  | 'CreateTopic'
  | 'Subscribe'
  | 'Unsubscribe'
  | 'CreatePlatformApplication'
  | 'CreatePlatformEndpoint'
  | 'SetTopicAttributes'
  | 'SetSubscriptionAttributes'
  | 'AddPermission'
  | 'RemovePermission'
  | 'TagResource'
  | 'UntagResource'
  | 'OptInPhoneNumber'
  | 'DeleteTopic'
  | 'DeletePlatformApplication'
  | 'DeleteEndpoint'
  | 'ConfirmSubscription';

interface SNSToolInput extends BaseToolInput {
  command: SNSCommand;
}

export class SNSTool extends BaseTool<SNSToolInput> {
  protected readonly toolName = 'SNSTool';

  private async getClient(): Promise<SNSClient> {
      return ClientManager.Instance.getClient('sns', async (session) => {
      const credentials = await session.GetCredentials();
      return new SNSClient({
        credentials,
        endpoint: session.AwsEndPoint,
        region: session.AwsRegion,
      });
    });
  }

  protected updateResourceContext(command: string, params: Record<string, any>): void {
     if ("TopicArn" in params) {
      AIHandler.Current.updateLatestResource({ type: 'SNS Topic', name: params.TopicArn });
    } else if ("TargetArn" in params) {
      AIHandler.Current.updateLatestResource({ type: 'SNS Target', name: params.TargetArn });
    } else if ("EndpointArn" in params) {
      AIHandler.Current.updateLatestResource({ type: 'SNS Endpoint', name: params.EndpointArn });
    }
  }

  protected async executeCommand(command: SNSCommand, params: Record<string, any>): Promise<any> {
    const client = await this.getClient();

    switch (command) {
      case 'CheckIfPhoneNumberIsOptedOut':
        return await client.send(new CheckIfPhoneNumberIsOptedOutCommand(params as any));
      case 'GetEndpointAttributes':
        return await client.send(new GetEndpointAttributesCommand(params as any));
      case 'GetPlatformApplicationAttributes':
        return await client.send(new GetPlatformApplicationAttributesCommand(params as any));
      case 'GetSMSAttributes':
        return await client.send(new GetSMSAttributesCommand(params as any));
      case 'GetSubscriptionAttributes':
        return await client.send(new GetSubscriptionAttributesCommand(params as any));
      case 'GetTopicAttributes':
        return await client.send(new GetTopicAttributesCommand(params as any));
      case 'ListPhoneNumbersOptedOut':
        return await client.send(new ListPhoneNumbersOptedOutCommand(params as any));
      case 'ListSubscriptionsByTopic':
        return await client.send(new ListSubscriptionsByTopicCommand(params as any));
      case 'ListSubscriptions':
        return await client.send(new ListSubscriptionsCommand(params as any));
      case 'ListTagsForResource':
        return await client.send(new ListTagsForResourceCommand(params as any));
      case 'ListTopics':
        return await client.send(new ListTopicsCommand(params as any));
      case 'Publish':
        return await client.send(new PublishCommand(params as any));
      case 'GetDataProtectionPolicy':
        return await client.send(new GetDataProtectionPolicyCommand(params as any));
      case 'GetSMSSandboxAccountStatus':
        return await client.send(new GetSMSSandboxAccountStatusCommand(params as any));
      case 'ListPlatformApplications':
        return await client.send(new ListPlatformApplicationsCommand(params as any));
      case 'ListEndpointsByPlatformApplication':
        return await client.send(new ListEndpointsByPlatformApplicationCommand(params as any));
      case 'ListOriginationNumbers':
        return await client.send(new ListOriginationNumbersCommand(params as any));
      case 'CreateTopic':
        return await client.send(new CreateTopicCommand(params as any));
      case 'Subscribe':
        return await client.send(new SubscribeCommand(params as any));
      case 'Unsubscribe':
        return await client.send(new UnsubscribeCommand(params as any));
      case 'CreatePlatformApplication':
        return await client.send(new CreatePlatformApplicationCommand(params as any));
      case 'CreatePlatformEndpoint':
        return await client.send(new CreatePlatformEndpointCommand(params as any));
      case 'SetTopicAttributes':
        return await client.send(new SetTopicAttributesCommand(params as any));
      case 'SetSubscriptionAttributes':
        return await client.send(new SetSubscriptionAttributesCommand(params as any));
      case 'AddPermission':
        return await client.send(new AddPermissionCommand(params as any));
      case 'RemovePermission':
        return await client.send(new RemovePermissionCommand(params as any));
      case 'TagResource':
        return await client.send(new TagResourceCommand(params as any));
      case 'UntagResource':
        return await client.send(new UntagResourceCommand(params as any));
      case 'OptInPhoneNumber':
        return await client.send(new OptInPhoneNumberCommand(params as any));
      case 'DeleteTopic':
        return await client.send(new DeleteTopicCommand(params as any));
      case 'DeletePlatformApplication':
        return await client.send(new DeletePlatformApplicationCommand(params as any));
      case 'DeleteEndpoint':
        return await client.send(new DeleteEndpointCommand(params as any));
      case 'ConfirmSubscription':
        return await client.send(new ConfirmSubscriptionCommand(params as any));
      default:
        throw new Error(`Unsupported command: ${command}`);
    }
  }
}
