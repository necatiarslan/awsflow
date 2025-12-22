import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { BaseTool } from '../common/BaseTool';
import { Session } from '../common/Session';
import { McpRequest, McpResponse } from './types';
import { S3Tool } from '../s3/S3Tool';
import { SNSTool } from '../sns/SNSTool';
import { SQSTool } from '../sqs/SQSTool';
import { EC2Tool } from '../ec2/EC2Tool';
import { FileOperationsTool } from '../common/FileOperationsTool';
import { SessionTool } from '../common/SessionTool';
import { CloudWatchLogTool } from '../cloudwatch/CloudWatchLogTool';
import { LambdaTool } from '../lambda/LambdaTool';
import { StepFuncTool } from '../stepfunc/StepFuncTool';
import { GlueTool } from '../glue/GlueTool';
import { IAMTool } from '../iam/IAMTool';
import { DynamoDBTool } from '../dynamodb/DynamoDBTool';
import { APIGatewayTool } from '../apigateway/APIGatewayTool';
import { RDSTool } from '../rds/RDSTool';
import { RDSDataTool } from '../rdsdata/RDSDataTool';
import { CloudFormationTool } from '../cloudformation/CloudFormationTool';
import { EMRTool } from '../emr/EMRTool';
import { STSTool } from '../sts/STSTool';
import { TestAwsConnectionTool } from '../sts/TestAwsConnectionTool';
import { needsConfirmation, confirmProceed } from '../common/ActionGuard';

interface ToolRecord {
    name: string;
    instance: BaseTool<any>;
}

export class McpDispatcher {
    private readonly tools: Map<string, ToolRecord>;
    private readonly toolMetadata: Map<string, any>;

    constructor(enabledTools: Set<string>) {
        this.tools = new Map<string, ToolRecord>();
        this.toolMetadata = new Map<string, any>();
        
        try {
            this.loadToolsFromPackageJson();
        } catch (error: any) {
            throw new Error(`Failed to load MCP tool definitions: ${error.message}`);
        }
        
        const allTools: ToolRecord[] = [
            { name: 'TestAwsConnectionTool', instance: new TestAwsConnectionTool() as BaseTool<any> },
            { name: 'STSTool', instance: new STSTool() as BaseTool<any> },
            { name: 'S3Tool', instance: new S3Tool() as BaseTool<any> },
            { name: 'SNSTool', instance: new SNSTool() as BaseTool<any> },
            { name: 'SQSTool', instance: new SQSTool() as BaseTool<any> },
            { name: 'EC2Tool', instance: new EC2Tool() as BaseTool<any> },
            { name: 'FileOperationsTool', instance: new FileOperationsTool() as BaseTool<any> },
            { name: 'SessionTool', instance: new SessionTool() as BaseTool<any> },
            { name: 'CloudWatchLogTool', instance: new CloudWatchLogTool() as BaseTool<any> },
            { name: 'LambdaTool', instance: new LambdaTool() as BaseTool<any> },
            { name: 'StepFuncTool', instance: new StepFuncTool() as BaseTool<any> },
            { name: 'GlueTool', instance: new GlueTool() as BaseTool<any> },
            { name: 'IAMTool', instance: new IAMTool() as BaseTool<any> },
            { name: 'DynamoDBTool', instance: new DynamoDBTool() as BaseTool<any> },
            { name: 'APIGatewayTool', instance: new APIGatewayTool() as BaseTool<any> },
            { name: 'RDSTool', instance: new RDSTool() as BaseTool<any> },
            { name: 'RDSDataTool', instance: new RDSDataTool() as BaseTool<any> },
            { name: 'CloudFormationTool', instance: new CloudFormationTool() as BaseTool<any> },
            { name: 'EMRTool', instance: new EMRTool() as BaseTool<any> }
        ];

        for (const t of allTools) {
            if (enabledTools.has(t.name)) {
                this.tools.set(t.name, t);
            }
        }
    }

    public listTools(): any[] {
        return Array.from(this.tools.keys())
            .map(name => {
                const metadata = this.toolMetadata.get(name);
                if (!metadata) {
                    return null; // Skip tools without metadata
                }
                return {
                    name: metadata.name,
                    description: metadata.modelDescription || metadata.userDescription || '',
                    inputSchema: metadata.inputSchema || { type: 'object' }
                };
            })
            .filter(tool => tool !== null);
    }

    private loadToolsFromPackageJson(): void {
        const packageJsonPath = path.join(__dirname, '../../package.json');
        
        if (!fs.existsSync(packageJsonPath)) {
            throw new Error('package.json not found');
        }

        let packageJson: any;
        try {
            const raw = fs.readFileSync(packageJsonPath, 'utf8');
            packageJson = JSON.parse(raw);
        } catch (error: any) {
            if (error instanceof SyntaxError) {
                throw new Error('Invalid JSON in package.json');
            }
            throw error;
        }

        const languageModelTools = packageJson?.contributes?.languageModelTools;
        if (!Array.isArray(languageModelTools)) {
            throw new Error('languageModelTools section missing in package.json');
        }

        for (const tool of languageModelTools) {
            if (tool.name) {
                this.toolMetadata.set(tool.name, tool);
            }
        }
    }

    public async handle(request: McpRequest): Promise<McpResponse | undefined> {
        try {
            if (request.method === 'initialize') {
                return {
                    id: request.id!,
                    jsonrpc: '2.0',
                    result: {
                        protocolVersion: '2024-11-05',
                        capabilities: {
                            tools: {},
                            resources: {},
                            prompts: {}
                        },
                        serverInfo: {
                            name: 'awsflow',
                            version: '1.0.3'
                        }
                    }
                };
            }

            if (request.method === 'notifications/initialized' || request.method === 'initialized') {
                return undefined;
            }

            if (request.id === undefined || request.id === null) {
                return undefined;
            }

            if (request.method === 'list_tools' || request.method === 'tools/list') {
                return { 
                    id: request.id!, 
                    jsonrpc: '2.0', 
                    result: { 
                        tools: this.listTools()
                    } 
                };
            }

            if (request.method === 'call_tool' || request.method === 'tools/call') {
                const toolName = (request.params?.tool || request.params?.name) as string;
                const args = (request.params?.params || request.params?.arguments) as Record<string, any> || {};
                const command = (request.params?.command || args?.command) as string;
                const params = (args?.params || args) as Record<string, any>;

                if (!toolName || !command) {
                    return { id: request.id!, jsonrpc: '2.0', error: { message: 'tool and command (or name and arguments) are required', code: -32602 } };
                }

                const tool = this.tools.get(toolName);
                if (!tool) {
                    return { id: request.id!, jsonrpc: '2.0', error: { message: `Tool ${toolName} is not enabled for MCP`, code: -32601 } };
                }

                if (!Session.Current) {
                    return { id: request.id!, jsonrpc: '2.0', error: { message: 'Session not initialized in VS Code', code: -32000 } };
                }

                if (needsConfirmation(command)) {
                    const ok = await confirmProceed(command, params);
                    if (!ok) {
                        return { id: request.id!, jsonrpc: '2.0', error: { message: 'User cancelled action command', code: -32000 } };
                    }
                }

                const s = Session.Current;
                const originalDisabledTools = s.DisabledTools;
                const originalDisabledCommands = s.DisabledCommands;

                s.DisabledTools = new Set();
                s.DisabledCommands = new Map();

                const tokenSource = new vscode.CancellationTokenSource();
                try {
                    const result = await tool.instance.invoke({
                        input: { command, params }
                    } as any, tokenSource.token);

                    const raw = (result as any).output ?? (result as any).content ?? result;
                    const content = Array.isArray(raw?.content) ? raw.content : Array.isArray(raw) ? raw : undefined;
                    let text: string | undefined;
                    if (content && content.length > 0) {
                        text = content.map((c: any) => c.value ?? c.text ?? '').join('');
                    } else if (typeof raw === 'string') {
                        text = raw;
                    }

                    if (!text) {
                        return { id: request.id!, jsonrpc: '2.0', result: { content: [{ type: 'text', text: JSON.stringify(raw) }] } };
                    }

                    let parsed: any = text;
                    try {
                        parsed = JSON.parse(text);
                    } catch (e) {
                        parsed = text;
                    }

                    return { 
                        id: request.id!, 
                        jsonrpc: '2.0', 
                        result: { 
                            content: [{ type: 'text', text: typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2) }] 
                        } 
                    };
                } finally {
                    tokenSource.dispose();
                    s.DisabledTools = originalDisabledTools;
                    s.DisabledCommands = originalDisabledCommands;
                }
            }

            return { id: request.id!, jsonrpc: '2.0', error: { message: `Method not found: ${request.method}`, code: -32601 } };
        } catch (error: any) {
            return { id: request.id!, jsonrpc: '2.0', error: { message: error?.message || 'Internal error', code: -32603, data: error?.stack } };
        }
    }
}
