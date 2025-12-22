import { BaseTool, BaseToolInput } from '../common/BaseTool';
import { ClientManager } from '../common/ClientManager';
import {
  IAMClient,
  GetRoleCommand,
  GetRolePolicyCommand,
  ListAttachedRolePoliciesCommand,
  ListRolePoliciesCommand,
  ListRolesCommand,
  ListRoleTagsCommand,
  GetPolicyCommand,
  GetPolicyVersionCommand,
  ListPoliciesCommand,
  ListPolicyVersionsCommand,
} from '@aws-sdk/client-iam';
import { AIHandler } from '../chat/AIHandler';

// Command type definition
type IAMCommand =
  | 'GetRole'
  | 'GetRolePolicy'
  | 'ListAttachedRolePolicies'
  | 'ListRolePolicies'
  | 'ListRoles'
  | 'ListRoleTags'
  | 'GetPolicy'
  | 'GetPolicyVersion'
  | 'ListPolicies'
  | 'ListPolicyVersions';

// Input interface - command + params object
interface IAMToolInput extends BaseToolInput {
  command: IAMCommand;
}

export class IAMTool extends BaseTool<IAMToolInput> {
  protected readonly toolName = 'IAMTool';

  private async getClient(): Promise<IAMClient> {
      return ClientManager.Instance.getClient('iam', async (session) => {
      const credentials = await session.GetCredentials();
      return new IAMClient({
        credentials,
        endpoint: session.AwsEndPoint,
        region: session.AwsRegion,
      });
    });
  }

  protected updateResourceContext(command: string, params: Record<string, any>): void {
     if("RoleName" in params){
      AIHandler.Current.updateLatestResource({ type: 'Role', name: params["RoleName"] });
    }
  }

  protected async executeCommand(command: IAMCommand, params: Record<string, any>): Promise<any> {
    const client = await this.getClient();

    switch (command) {
      case 'GetRole':
        return await client.send(new GetRoleCommand(params as any));
      case 'GetRolePolicy':
        return await client.send(new GetRolePolicyCommand(params as any));
      case 'ListAttachedRolePolicies':
        return await client.send(new ListAttachedRolePoliciesCommand(params as any));
      case 'ListRolePolicies':
        return await client.send(new ListRolePoliciesCommand(params as any));
      case 'ListRoles':
        return await client.send(new ListRolesCommand(params as any));
      case 'ListRoleTags':
        return await client.send(new ListRoleTagsCommand(params as any));
      case 'GetPolicy':
        return await client.send(new GetPolicyCommand(params as any));
      case 'GetPolicyVersion':
        return await client.send(new GetPolicyVersionCommand(params as any));
      case 'ListPolicies':
        return await client.send(new ListPoliciesCommand(params as any));
      case 'ListPolicyVersions':
        return await client.send(new ListPolicyVersionsCommand(params as any));
      default:
        throw new Error(`Unsupported command: ${command}`);
    }
  }
}
