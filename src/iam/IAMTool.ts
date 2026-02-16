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
  SimulatePrincipalPolicyCommand,
  GetUserCommand,
  ListUsersCommand,
  GetAccountSummaryCommand,
  GetAccountPasswordPolicyCommand,
  ListGroupsCommand,
  GenerateCredentialReportCommand,
  GetCredentialReportCommand,
  ListAccessKeysCommand,
  ListMFADevicesCommand,
  GetServiceLastAccessedDetailsCommand,
  CreateRoleCommand,
  CreateUserCommand,
  CreateGroupCommand,
  CreatePolicyCommand,
  CreateAccessKeyCommand,
  AttachRolePolicyCommand,
  AttachUserPolicyCommand,
  AttachGroupPolicyCommand,
  PutRolePolicyCommand,
  PutUserPolicyCommand,
  PutGroupPolicyCommand,
  CreateInstanceProfileCommand,
  AddRoleToInstanceProfileCommand,
  CreateServiceLinkedRoleCommand,
  TagRoleCommand,
  TagUserCommand,
  TagPolicyCommand,
  DeleteRoleCommand,
  DeleteUserCommand,
  DeleteGroupCommand,
  DeletePolicyCommand,
  DetachRolePolicyCommand,
  DetachUserPolicyCommand,
  DetachGroupPolicyCommand,
  DeleteRolePolicyCommand,
  DeleteUserPolicyCommand,
  DeleteGroupPolicyCommand,
  DeleteAccessKeyCommand,
  RemoveRoleFromInstanceProfileCommand,
  DeleteInstanceProfileCommand,
  UntagRoleCommand,
  UntagUserCommand,
  UntagPolicyCommand,
  UpdateAssumeRolePolicyCommand,
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
  | 'ListPolicyVersions'
  | 'SimulatePrincipalPolicy'
  | 'GetUser'
  | 'ListUsers'
  | 'GetAccountSummary'
  | 'GetAccountPasswordPolicy'
  | 'ListGroups'
  | 'GenerateCredentialReport'
  | 'GetCredentialReport'
  | 'ListAccessKeys'
  | 'ListMFADevices'
  | 'GetServiceLastAccessedDetails'
  | 'CreateRole'
  | 'CreateUser'
  | 'CreateGroup'
  | 'CreatePolicy'
  | 'CreateAccessKey'
  | 'AttachRolePolicy'
  | 'AttachUserPolicy'
  | 'AttachGroupPolicy'
  | 'PutRolePolicy'
  | 'PutUserPolicy'
  | 'PutGroupPolicy'
  | 'CreateInstanceProfile'
  | 'AddRoleToInstanceProfile'
  | 'CreateServiceLinkedRole'
  | 'TagRole'
  | 'TagUser'
  | 'TagPolicy'
  | 'DeleteRole'
  | 'DeleteUser'
  | 'DeleteGroup'
  | 'DeletePolicy'
  | 'DetachRolePolicy'
  | 'DetachUserPolicy'
  | 'DetachGroupPolicy'
  | 'DeleteRolePolicy'
  | 'DeleteUserPolicy'
  | 'DeleteGroupPolicy'
  | 'DeleteAccessKey'
  | 'RemoveRoleFromInstanceProfile'
  | 'DeleteInstanceProfile'
  | 'UntagRole'
  | 'UntagUser'
  | 'UntagPolicy'
  | 'UpdateAssumeRolePolicy';

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
    if("UserName" in params){
      AIHandler.Current.updateLatestResource({ type: 'User', name: params["UserName"] });
    }
    if("GroupName" in params){
      AIHandler.Current.updateLatestResource({ type: 'Group', name: params["GroupName"] });
    }
    if("PolicyName" in params){
      AIHandler.Current.updateLatestResource({ type: 'Policy', name: params["PolicyName"] });
    }
    if("PolicyArn" in params){
      AIHandler.Current.updateLatestResource({ type: 'Policy', name: params["PolicyArn"] });
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
      case 'SimulatePrincipalPolicy':
        return await client.send(new SimulatePrincipalPolicyCommand(params as any));
      case 'GetUser':
        return await client.send(new GetUserCommand(params as any));
      case 'ListUsers':
        return await client.send(new ListUsersCommand(params as any));
      case 'GetAccountSummary':
        return await client.send(new GetAccountSummaryCommand(params as any));
      case 'GetAccountPasswordPolicy':
        return await client.send(new GetAccountPasswordPolicyCommand(params as any));
      case 'ListGroups':
        return await client.send(new ListGroupsCommand(params as any));
      case 'GenerateCredentialReport':
        return await client.send(new GenerateCredentialReportCommand(params as any));
      case 'GetCredentialReport':
        return await client.send(new GetCredentialReportCommand(params as any));
      case 'ListAccessKeys':
        return await client.send(new ListAccessKeysCommand(params as any));
      case 'ListMFADevices':
        return await client.send(new ListMFADevicesCommand(params as any));
      case 'GetServiceLastAccessedDetails':
        return await client.send(new GetServiceLastAccessedDetailsCommand(params as any));
      case 'CreateRole':
        return await client.send(new CreateRoleCommand(params as any));
      case 'CreateUser':
        return await client.send(new CreateUserCommand(params as any));
      case 'CreateGroup':
        return await client.send(new CreateGroupCommand(params as any));
      case 'CreatePolicy':
        return await client.send(new CreatePolicyCommand(params as any));
      case 'CreateAccessKey':
        return await client.send(new CreateAccessKeyCommand(params as any));
      case 'AttachRolePolicy':
        return await client.send(new AttachRolePolicyCommand(params as any));
      case 'AttachUserPolicy':
        return await client.send(new AttachUserPolicyCommand(params as any));
      case 'AttachGroupPolicy':
        return await client.send(new AttachGroupPolicyCommand(params as any));
      case 'PutRolePolicy':
        return await client.send(new PutRolePolicyCommand(params as any));
      case 'PutUserPolicy':
        return await client.send(new PutUserPolicyCommand(params as any));
      case 'PutGroupPolicy':
        return await client.send(new PutGroupPolicyCommand(params as any));
      case 'CreateInstanceProfile':
        return await client.send(new CreateInstanceProfileCommand(params as any));
      case 'AddRoleToInstanceProfile':
        return await client.send(new AddRoleToInstanceProfileCommand(params as any));
      case 'CreateServiceLinkedRole':
        return await client.send(new CreateServiceLinkedRoleCommand(params as any));
      case 'TagRole':
        return await client.send(new TagRoleCommand(params as any));
      case 'TagUser':
        return await client.send(new TagUserCommand(params as any));
      case 'TagPolicy':
        return await client.send(new TagPolicyCommand(params as any));
      case 'DeleteRole':
        return await client.send(new DeleteRoleCommand(params as any));
      case 'DeleteUser':
        return await client.send(new DeleteUserCommand(params as any));
      case 'DeleteGroup':
        return await client.send(new DeleteGroupCommand(params as any));
      case 'DeletePolicy':
        return await client.send(new DeletePolicyCommand(params as any));
      case 'DetachRolePolicy':
        return await client.send(new DetachRolePolicyCommand(params as any));
      case 'DetachUserPolicy':
        return await client.send(new DetachUserPolicyCommand(params as any));
      case 'DetachGroupPolicy':
        return await client.send(new DetachGroupPolicyCommand(params as any));
      case 'DeleteRolePolicy':
        return await client.send(new DeleteRolePolicyCommand(params as any));
      case 'DeleteUserPolicy':
        return await client.send(new DeleteUserPolicyCommand(params as any));
      case 'DeleteGroupPolicy':
        return await client.send(new DeleteGroupPolicyCommand(params as any));
      case 'DeleteAccessKey':
        return await client.send(new DeleteAccessKeyCommand(params as any));
      case 'RemoveRoleFromInstanceProfile':
        return await client.send(new RemoveRoleFromInstanceProfileCommand(params as any));
      case 'DeleteInstanceProfile':
        return await client.send(new DeleteInstanceProfileCommand(params as any));
      case 'UntagRole':
        return await client.send(new UntagRoleCommand(params as any));
      case 'UntagUser':
        return await client.send(new UntagUserCommand(params as any));
      case 'UntagPolicy':
        return await client.send(new UntagPolicyCommand(params as any));
      case 'UpdateAssumeRolePolicy':
        return await client.send(new UpdateAssumeRolePolicyCommand(params as any));
      default:
        throw new Error(`Unsupported command: ${command}`);
    }
  }
}
