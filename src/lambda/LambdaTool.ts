import { BaseTool, BaseToolInput } from '../common/BaseTool';
import { ClientManager } from '../common/ClientManager';
import {
  LambdaClient,
  ListFunctionsCommand,
  GetFunctionCommand,
  GetFunctionConfigurationCommand,
  UpdateFunctionCodeCommand,
  ListTagsCommand,
  TagResourceCommand,
  UntagResourceCommand,
  InvokeCommand,
  ListEventSourceMappingsCommand,
  GetEventSourceMappingCommand,
  GetFunctionConcurrencyCommand,
  GetFunctionUrlConfigCommand,
  ListVersionsByFunctionCommand,
  ListAliasesCommand,
  GetAliasCommand,
  GetAccountSettingsCommand,
  GetFunctionCodeSigningConfigCommand,
  GetPolicyCommand,
  ListLayerVersionsCommand,
  ListFunctionsByCodeSigningConfigCommand,
} from '@aws-sdk/client-lambda';
import { AIHandler } from '../chat/AIHandler';

// Command type definition
type LambdaCommand =
  | 'ListFunctions'
  | 'GetFunction'
  | 'GetFunctionConfiguration'
  | 'UpdateFunctionCode'
  | 'ListTags'
  | 'TagResource'
  | 'UntagResource'
  | 'Invoke'
  | 'ListEventSourceMappings'
  | 'GetEventSourceMapping'
  | 'GetFunctionConcurrency'
  | 'GetFunctionUrlConfig'
  | 'ListVersionsByFunction'
  | 'ListAliases'
  | 'GetAlias'
  | 'GetAccountSettings'
  | 'GetFunctionCodeSigningConfig'
  | 'GetPolicy'
  | 'ListLayerVersions'
  | 'ListFunctionsByCodeSigningConfig';

// Input interface - command + params object
interface LambdaToolInput extends BaseToolInput {
  command: LambdaCommand;
}

// Command parameter interfaces for type safety
interface ListFunctionsParams {
  FunctionVersion?: 'ALL';
  Marker?: string;
  MaxItems?: number;
  MasterRegion?: string;
}

interface GetFunctionParams {
  FunctionName: string;
  Qualifier?: string;
}

interface GetFunctionConfigurationParams {
  FunctionName: string;
  Qualifier?: string;
}

interface UpdateFunctionCodeParams {
  FunctionName: string;
  ZipFile?: Uint8Array | string; // base64 encoded zip
  S3Bucket?: string;
  S3Key?: string;
  S3ObjectVersion?: string;
  ImageUri?: string;
  Publish?: boolean;
  DryRun?: boolean;
  RevisionId?: string;
  Architectures?: string[];
}

interface ListTagsParams {
  Resource: string; // Function ARN
}

interface TagResourceParams {
  Resource: string; // Function ARN
  Tags: Record<string, string>;
}

interface UntagResourceParams {
  Resource: string; // Function ARN
  TagKeys: string[];
}

interface InvokeParams {
  FunctionName: string;
  InvocationType?: 'Event' | 'RequestResponse' | 'DryRun';
  LogType?: 'None' | 'Tail';
  ClientContext?: string;
  Payload?: string; // JSON string
  Qualifier?: string;
}

export class LambdaTool extends BaseTool<LambdaToolInput> {
  protected readonly toolName = 'LambdaTool';

  private async getClient(): Promise<LambdaClient> {
    return ClientManager.Instance.getClient('lambda', async (session) => {
      const credentials = await session.GetCredentials();
      return new LambdaClient({
        credentials,
        endpoint: session.AwsEndPoint,
        region: session.AwsRegion,
      });
    });
  }

  protected updateResourceContext(command: string, params: Record<string, any>): void {
     if ("FunctionName" in params) {
      AIHandler.Current.updateLatestResource({ type: 'Lambda Function', name: params["FunctionName"] });
    }
  }

  protected async executeCommand(command: LambdaCommand, params: Record<string, any>): Promise<any> {
    const client = await this.getClient();

    switch (command) {
      case 'ListFunctions':
        return await client.send(new ListFunctionsCommand(params as ListFunctionsParams));
      
      case 'GetFunction':
        return await this.executeGetFunction(params as GetFunctionParams);
      
      case 'GetFunctionConfiguration':
        return await this.executeGetFunctionConfiguration(params as GetFunctionConfigurationParams);
      
      case 'UpdateFunctionCode':
        return await this.executeUpdateFunctionCode(params as UpdateFunctionCodeParams);
      
      case 'ListTags':
        return await client.send(new ListTagsCommand(params as ListTagsParams));
      
      case 'TagResource':
        return await client.send(new TagResourceCommand(params as TagResourceParams));
      
      case 'UntagResource':
        return await client.send(new UntagResourceCommand(params as UntagResourceParams));
      
      case 'Invoke':
        return await this.executeInvoke(params as InvokeParams);
      
      case 'ListEventSourceMappings':
        return await client.send(new ListEventSourceMappingsCommand(params as any));
      
      case 'GetEventSourceMapping':
        return await client.send(new GetEventSourceMappingCommand(params as any));
      
      case 'GetFunctionConcurrency':
        return await client.send(new GetFunctionConcurrencyCommand(params as any));
      
      case 'GetFunctionUrlConfig':
        return await client.send(new GetFunctionUrlConfigCommand(params as any));
      
      case 'ListVersionsByFunction':
        return await client.send(new ListVersionsByFunctionCommand(params as any));
      
      case 'ListAliases':
        return await client.send(new ListAliasesCommand(params as any));
      
      case 'GetAlias':
        return await client.send(new GetAliasCommand(params as any));
      
      case 'GetAccountSettings':
        return await client.send(new GetAccountSettingsCommand(params as any));
      
      case 'GetFunctionCodeSigningConfig':
        return await client.send(new GetFunctionCodeSigningConfigCommand(params as any));
      
      case 'GetPolicy':
        return await client.send(new GetPolicyCommand(params as any));
      
      case 'ListLayerVersions':
        return await client.send(new ListLayerVersionsCommand(params as any));
      
      case 'ListFunctionsByCodeSigningConfig':
        return await client.send(new ListFunctionsByCodeSigningConfigCommand(params as any));
      
      default:
        throw new Error(`Unsupported command: ${command}`);
    }
  }

  private async executeGetFunction(params: GetFunctionParams): Promise<any> {
    const client = await this.getClient();
    const command = new GetFunctionCommand(params);
    const result = await client.send(command);
    
    // Extract and store LogGroup if available
    if (result.Configuration?.LoggingConfig?.LogGroup) {
      AIHandler.Current.updateLatestResource({ 
        type: 'CloudWatch Log Group', 
        name: result.Configuration.LoggingConfig.LogGroup 
      });
    }
    return result;
  }

  private async executeGetFunctionConfiguration(params: GetFunctionConfigurationParams): Promise<any> {
    const client = await this.getClient();
    const command = new GetFunctionConfigurationCommand(params);
    const result = await client.send(command);
    
    // Extract and store LogGroup if available
    if (result.LoggingConfig?.LogGroup) {
      AIHandler.Current.updateLatestResource({ 
        type: 'CloudWatch Log Group', 
        name: result.LoggingConfig.LogGroup 
      });
    }
    return result;
  }

  private async executeUpdateFunctionCode(params: UpdateFunctionCodeParams): Promise<any> {
    const client = await this.getClient();
    
    // Convert base64 string to Uint8Array if ZipFile is provided as string
    const commandParams: any = { ...params };
    if (commandParams.ZipFile && typeof commandParams.ZipFile === 'string') {
      commandParams.ZipFile = Uint8Array.from(Buffer.from(commandParams.ZipFile, 'base64'));
    }
    
    const command = new UpdateFunctionCodeCommand(commandParams);
    return await client.send(command);
  }

  private async executeInvoke(params: InvokeParams): Promise<any> {
    const client = await this.getClient();
    const command = new InvokeCommand(params);
    const result = await client.send(command);
    
    // Decode the payload if present
    if (result.Payload) {
      const decoder = new TextDecoder();
      const payloadString = decoder.decode(result.Payload);
      return {
        ...result,
        Payload: payloadString as any // Return as string for easier consumption
      };
    }
    
    return result;
  }
}

