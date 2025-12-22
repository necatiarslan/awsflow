import { BaseTool, BaseToolInput } from '../common/BaseTool';
import { ClientManager } from '../common/ClientManager';
import {
  APIGatewayClient,
  GetAccountCommand,
  GetApiKeyCommand,
  GetApiKeysCommand,
  GetAuthorizerCommand,
  GetAuthorizersCommand,
  GetBasePathMappingCommand,
  GetBasePathMappingsCommand,
  GetClientCertificateCommand,
  GetClientCertificatesCommand,
  GetDeploymentCommand,
  GetDeploymentsCommand,
  GetDocumentationPartCommand,
  GetDocumentationPartsCommand,
  GetDocumentationVersionCommand,
  GetDocumentationVersionsCommand,
  GetDomainNameCommand,
  GetDomainNamesCommand,
  GetExportCommand,
  GetGatewayResponseCommand,
  GetGatewayResponsesCommand,
  GetIntegrationCommand,
  GetIntegrationResponseCommand,
  GetMethodCommand,
  GetModelCommand,
  GetModelsCommand,
  GetRequestValidatorCommand,
  GetRequestValidatorsCommand,
  GetResourceCommand,
  GetResourcesCommand,
  GetRestApiCommand,
  GetRestApisCommand,
  GetSdkCommand,
  GetSdkTypeCommand,
  GetSdkTypesCommand,
  GetStageCommand,
  GetStagesCommand,
  GetTagsCommand,
  GetUsageCommand,
  GetUsagePlanCommand,
  GetUsagePlanKeyCommand,
  GetUsagePlanKeysCommand,
  GetUsagePlansCommand,
  GetVpcLinkCommand,
  GetVpcLinksCommand,
} from '@aws-sdk/client-api-gateway';
import { AIHandler } from '../chat/AIHandler';

type APIGatewayCommand =
  | 'GetAccount'
  | 'GetApiKey'
  | 'GetApiKeys'
  | 'GetAuthorizer'
  | 'GetAuthorizers'
  | 'GetBasePathMapping'
  | 'GetBasePathMappings'
  | 'GetClientCertificate'
  | 'GetClientCertificates'
  | 'GetDeployment'
  | 'GetDeployments'
  | 'GetDocumentationPart'
  | 'GetDocumentationParts'
  | 'GetDocumentationVersion'
  | 'GetDocumentationVersions'
  | 'GetDomainName'
  | 'GetDomainNames'
  | 'GetExport'
  | 'GetGatewayResponse'
  | 'GetGatewayResponses'
  | 'GetIntegration'
  | 'GetIntegrationResponse'
  | 'GetMethod'
  | 'GetModel'
  | 'GetModels'
  | 'GetRequestValidator'
  | 'GetRequestValidators'
  | 'GetResource'
  | 'GetResources'
  | 'GetRestApi'
  | 'GetRestApis'
  | 'GetSdk'
  | 'GetSdkType'
  | 'GetSdkTypes'
  | 'GetStage'
  | 'GetStages'
  | 'GetTags'
  | 'GetUsage'
  | 'GetUsagePlan'
  | 'GetUsagePlanKey'
  | 'GetUsagePlanKeys'
  | 'GetUsagePlans'
  | 'GetVpcLink'
  | 'GetVpcLinks';

interface APIGatewayToolInput extends BaseToolInput {
  command: APIGatewayCommand;
}

export class APIGatewayTool extends BaseTool<APIGatewayToolInput> {
  protected readonly toolName = 'APIGatewayTool';

  private async getClient(): Promise<APIGatewayClient> {
      return ClientManager.Instance.getClient('apigateway', async (session) => {
      const credentials = await session.GetCredentials();
      return new APIGatewayClient({
        credentials,
        endpoint: session.AwsEndPoint,
        region: session.AwsRegion,
      });
    });
  }

  protected updateResourceContext(command: string, params: Record<string, any>): void {
     if (params?.restApiId) {
      AIHandler.Current.updateLatestResource({ type: 'API Gateway REST API', name: params.restApiId });
    }
  }

  protected async executeCommand(command: APIGatewayCommand, params: Record<string, any>): Promise<any> {
    const client = await this.getClient();

    switch (command) {
      case 'GetAccount': return await client.send(new GetAccountCommand(params as any));
      case 'GetApiKey': return await client.send(new GetApiKeyCommand(params as any));
      case 'GetApiKeys': return await client.send(new GetApiKeysCommand(params as any));
      case 'GetAuthorizer': return await client.send(new GetAuthorizerCommand(params as any));
      case 'GetAuthorizers': return await client.send(new GetAuthorizersCommand(params as any));
      case 'GetBasePathMapping': return await client.send(new GetBasePathMappingCommand(params as any));
      case 'GetBasePathMappings': return await client.send(new GetBasePathMappingsCommand(params as any));
      case 'GetClientCertificate': return await client.send(new GetClientCertificateCommand(params as any));
      case 'GetClientCertificates': return await client.send(new GetClientCertificatesCommand(params as any));
      case 'GetDeployment': return await client.send(new GetDeploymentCommand(params as any));
      case 'GetDeployments': return await client.send(new GetDeploymentsCommand(params as any));
      case 'GetDocumentationPart': return await client.send(new GetDocumentationPartCommand(params as any));
      case 'GetDocumentationParts': return await client.send(new GetDocumentationPartsCommand(params as any));
      case 'GetDocumentationVersion': return await client.send(new GetDocumentationVersionCommand(params as any));
      case 'GetDocumentationVersions': return await client.send(new GetDocumentationVersionsCommand(params as any));
      case 'GetDomainName': return await client.send(new GetDomainNameCommand(params as any));
      case 'GetDomainNames': return await client.send(new GetDomainNamesCommand(params as any));
      case 'GetExport': return await client.send(new GetExportCommand(params as any));
      case 'GetGatewayResponse': return await client.send(new GetGatewayResponseCommand(params as any));
      case 'GetGatewayResponses': return await client.send(new GetGatewayResponsesCommand(params as any));
      case 'GetIntegration': return await client.send(new GetIntegrationCommand(params as any));
      case 'GetIntegrationResponse': return await client.send(new GetIntegrationResponseCommand(params as any));
      case 'GetMethod': return await client.send(new GetMethodCommand(params as any));
      case 'GetModel': return await client.send(new GetModelCommand(params as any));
      case 'GetModels': return await client.send(new GetModelsCommand(params as any));
      case 'GetRequestValidator': return await client.send(new GetRequestValidatorCommand(params as any));
      case 'GetRequestValidators': return await client.send(new GetRequestValidatorsCommand(params as any));
      case 'GetResource': return await client.send(new GetResourceCommand(params as any));
      case 'GetResources': return await client.send(new GetResourcesCommand(params as any));
      case 'GetRestApi': return await client.send(new GetRestApiCommand(params as any));
      case 'GetRestApis': return await client.send(new GetRestApisCommand(params as any));
      case 'GetSdk': return await client.send(new GetSdkCommand(params as any));
      case 'GetSdkType': return await client.send(new GetSdkTypeCommand(params as any));
      case 'GetSdkTypes': return await client.send(new GetSdkTypesCommand(params as any));
      case 'GetStage': return await client.send(new GetStageCommand(params as any));
      case 'GetStages': return await client.send(new GetStagesCommand(params as any));
      case 'GetTags': return await client.send(new GetTagsCommand(params as any));
      case 'GetUsage': return await client.send(new GetUsageCommand(params as any));
      case 'GetUsagePlan': return await client.send(new GetUsagePlanCommand(params as any));
      case 'GetUsagePlanKey': return await client.send(new GetUsagePlanKeyCommand(params as any));
      case 'GetUsagePlanKeys': return await client.send(new GetUsagePlanKeysCommand(params as any));
      case 'GetUsagePlans': return await client.send(new GetUsagePlansCommand(params as any));
      case 'GetVpcLink': return await client.send(new GetVpcLinkCommand(params as any));
      case 'GetVpcLinks': return await client.send(new GetVpcLinksCommand(params as any));
      default:
        throw new Error(`Unsupported command: ${command}`);
    }
  }
}
