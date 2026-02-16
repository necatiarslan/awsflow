import { BaseTool, BaseToolInput } from '../common/BaseTool';
import { ClientManager } from '../common/ClientManager';
import { Session } from '../common/Session';
import {
  CloudWatchLogsClient,
  DescribeLogGroupsCommand,
  DescribeLogStreamsCommand,
  GetLogEventsCommand,
  FilterLogEventsCommand,
  StartQueryCommand,
  GetQueryResultsCommand,
  DescribeQueryDefinitionsCommand,
  DescribeMetricFiltersCommand,
  DescribeSubscriptionFiltersCommand,
  GetLogGroupFieldsCommand,
  DescribeDestinationsCommand,
  CreateLogGroupCommand,
  CreateLogStreamCommand,
  PutLogEventsCommand,
  PutMetricFilterCommand,
  PutSubscriptionFilterCommand,
  PutRetentionPolicyCommand,
  PutResourcePolicyCommand,
  DeleteLogGroupCommand,
  DeleteLogStreamCommand,
  DeleteMetricFilterCommand,
  DeleteSubscriptionFilterCommand,
  DeleteRetentionPolicyCommand,
  DeleteResourcePolicyCommand,
  TagLogGroupCommand,
  UntagLogGroupCommand,
} from '@aws-sdk/client-cloudwatch-logs';
import { AIHandler } from '../chat/AIHandler';
import { CloudWatchLogView } from './CloudWatchLogView';

// Command type definition
type CloudWatchCommand =
  | 'DescribeLogGroups'
  | 'DescribeLogStreams'
  | 'GetLogEvents'
  | 'FilterLogEvents'
  | 'StartQuery'
  | 'GetQueryResults'
  | 'DescribeQueryDefinitions'
  | 'DescribeMetricFilters'
  | 'DescribeSubscriptionFilters'
  | 'GetLogGroupFields'
  | 'DescribeDestinations'
  | 'OpenCloudWatchLogView'
  | 'CreateLogGroup'
  | 'CreateLogStream'
  | 'PutLogEvents'
  | 'PutMetricFilter'
  | 'PutSubscriptionFilter'
  | 'PutRetentionPolicy'
  | 'PutResourcePolicy'
  | 'DeleteLogGroup'
  | 'DeleteLogStream'
  | 'DeleteMetricFilter'
  | 'DeleteSubscriptionFilter'
  | 'DeleteRetentionPolicy'
  | 'DeleteResourcePolicy'
  | 'TagLogGroup'
  | 'UntagLogGroup';

// Input interface - command + params object
interface CloudWatchToolInput extends BaseToolInput {
  command: CloudWatchCommand;
}

export class CloudWatchLogTool extends BaseTool<CloudWatchToolInput> {
  protected readonly toolName = 'CloudWatchLogTool';

  private async getClient(): Promise<CloudWatchLogsClient> {
      return ClientManager.Instance.getClient('cloudwatchlogs', async (session) => {
      const credentials = await session.GetCredentials();
      return new CloudWatchLogsClient({
        credentials,
        region: session.AwsRegion,
        endpoint: session.AwsEndPoint,
      });
    });
  }

  private async executeOpenCloudWatchLogView(params: any): Promise<any> {
    if (!Session.Current) {
      throw new Error('Session not initialized');
    }

    // Open the CloudWatchLogView
    CloudWatchLogView.Render(Session.Current.ExtensionUri, Session.Current.AwsRegion, params.logGroupName, params.logStreamName || '');

    return {
      success: true,
      message: `CloudWatch Log View opened for log group: ${params.logGroupName}${params.logStreamName ? `, log stream: ${params.logStreamName}` : ''}`,
      logGroupName: params.logGroupName,
      logStreamName: params.logStreamName
    };
  }

  protected updateResourceContext(command: string, params: Record<string, any>): void {
     if ("logGroupName" in params) {
      AIHandler.Current.updateLatestResource({ type: "CloudWatch Log Group", name: params.logGroupName });
    }
    if ("logStreamName" in params) {
      AIHandler.Current.updateLatestResource({ type: "CloudWatch Log Stream", name: params.logStreamName });
    }
  }

  protected async executeCommand(command: CloudWatchCommand, params: Record<string, any>): Promise<any> {
    const client = await this.getClient();

    switch (command) {
      case 'DescribeLogGroups':
        return await client.send(new DescribeLogGroupsCommand(params as any));
      case 'DescribeLogStreams':
        return await client.send(new DescribeLogStreamsCommand(params as any));
      case 'GetLogEvents':
        return await client.send(new GetLogEventsCommand(params as any));
      case 'FilterLogEvents':
        return await client.send(new FilterLogEventsCommand(params as any));
      case 'StartQuery':
        return await client.send(new StartQueryCommand(params as any));
      case 'GetQueryResults':
        return await client.send(new GetQueryResultsCommand(params as any));
      case 'DescribeQueryDefinitions':
        return await client.send(new DescribeQueryDefinitionsCommand(params as any));
      case 'DescribeMetricFilters':
        return await client.send(new DescribeMetricFiltersCommand(params as any));
      case 'DescribeSubscriptionFilters':
        return await client.send(new DescribeSubscriptionFiltersCommand(params as any));
      case 'GetLogGroupFields':
        return await client.send(new GetLogGroupFieldsCommand(params as any));
      case 'DescribeDestinations':
        return await client.send(new DescribeDestinationsCommand(params as any));
      case 'OpenCloudWatchLogView':
        return await this.executeOpenCloudWatchLogView(params);
      case 'CreateLogGroup':
        return await client.send(new CreateLogGroupCommand(params as any));
      case 'CreateLogStream':
        return await client.send(new CreateLogStreamCommand(params as any));
      case 'PutLogEvents':
        return await client.send(new PutLogEventsCommand(params as any));
      case 'PutMetricFilter':
        return await client.send(new PutMetricFilterCommand(params as any));
      case 'PutSubscriptionFilter':
        return await client.send(new PutSubscriptionFilterCommand(params as any));
      case 'PutRetentionPolicy':
        return await client.send(new PutRetentionPolicyCommand(params as any));
      case 'PutResourcePolicy':
        return await client.send(new PutResourcePolicyCommand(params as any));
      case 'DeleteLogGroup':
        return await client.send(new DeleteLogGroupCommand(params as any));
      case 'DeleteLogStream':
        return await client.send(new DeleteLogStreamCommand(params as any));
      case 'DeleteMetricFilter':
        return await client.send(new DeleteMetricFilterCommand(params as any));
      case 'DeleteSubscriptionFilter':
        return await client.send(new DeleteSubscriptionFilterCommand(params as any));
      case 'DeleteRetentionPolicy':
        return await client.send(new DeleteRetentionPolicyCommand(params as any));
      case 'DeleteResourcePolicy':
        return await client.send(new DeleteResourcePolicyCommand(params as any));
      case 'TagLogGroup':
        return await client.send(new TagLogGroupCommand(params as any));
      case 'UntagLogGroup':
        return await client.send(new UntagLogGroupCommand(params as any));
      default:
        throw new Error(`Unsupported command: ${command}`);
    }
  }
}
