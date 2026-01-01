import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { BaseTool } from '../common/BaseTool';
import { Session } from '../common/Session';
import { McpRequest, McpResponse } from './types';
import { McpSession } from './McpSession';
//import { needsConfirmation, confirmProceed } from '../common/ActionGuard';

interface ToolRecord {
    name: string;
    instance: BaseTool<any>;
}

interface ResourceRecord {
    uri: string;
    name: string;
    description?: string;
    mimeType?: string;
}

export class McpDispatcher {
    private readonly tools: Map<string, ToolRecord>;
    private readonly toolMetadata: Map<string, any>;
    private readonly resources: ResourceRecord[];

    constructor(enabledTools: Set<string>) {
        this.tools = new Map<string, ToolRecord>();
        this.toolMetadata = new Map<string, any>();
        this.resources = [
            {
                uri: `file://${path.join(__dirname, '../../README_AWS_SERVICES.md')}`,
                name: 'README_AWS_SERVICES',
                description: 'Reference for AWS services supported by Awsflow MCP tools',
                mimeType: 'text/markdown'
            }
        ];
        
        try {
            this.loadToolsFromPackageJson();
        } catch (error: any) {
            throw new Error(`Failed to load MCP tool definitions: ${error.message}`);
        }
        
        // Load tools dynamically from generated registry
        const { MCP_TOOLS } = require('../tool_registry/ToolRegistry');
        const allTools: ToolRecord[] = MCP_TOOLS.map((t: any) => ({
            name: t.name,
            instance: t.instance as BaseTool<any>
        }));

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

    private listResources(): any[] {
        return this.resources.map(r => ({
            uri: r.uri,
            name: r.name,
            description: r.description || '',
            mimeType: r.mimeType || 'text/plain'
        }));
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
            McpSession.Current?.writeLine(`Request Method: ${request.method}`);

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
                            version: '1.0.0'
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

            if (request.method === 'list_resources' || request.method === 'resources/list') {
                return {
                    id: request.id!,
                    jsonrpc: '2.0',
                    result: {
                        resources: this.listResources()
                    }
                };
            }

            if (request.method === 'read_resource' || request.method === 'resources/read') {
                const uri = request.params?.uri as string;
                if (!uri) {
                    return { id: request.id!, jsonrpc: '2.0', error: { message: 'uri is required', code: -32602 } };
                }

                const resource = this.resources.find(r => r.uri === uri);
                if (!resource) {
                    return { id: request.id!, jsonrpc: '2.0', error: { message: `Resource not found: ${uri}`, code: -32004 } };
                }

                try {
                    const filePath = uri.replace(/^file:\/\//, '');
                    const content = fs.readFileSync(filePath, 'utf8');
                    return {
                        id: request.id!,
                        jsonrpc: '2.0',
                        result: {
                            contents: [
                                {
                                    uri: resource.uri,
                                    mimeType: resource.mimeType || 'text/plain',
                                    text: content
                                }
                            ]
                        }
                    };
                } catch (error: any) {
                    return { id: request.id!, jsonrpc: '2.0', error: { message: error?.message || 'Failed to read resource', code: -32005 } };
                }
            }

            if (request.method === 'call_tool' || request.method === 'tools/call') {
                const toolName = (request.params?.tool || request.params?.name) as string;
                const args = (request.params?.params || request.params?.arguments) as Record<string, any> || {};
                const command = (request.params?.command || args?.command) as string;
                const params = (args?.params || args) as Record<string, any>;

                McpSession.Current?.writeLine(`Calling toolName: ${toolName}, command: ${command}`);

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

                // if (needsConfirmation(command)) {
                //     const ok = await confirmProceed(command, params);
                //     if (!ok) {
                //         return { id: request.id!, jsonrpc: '2.0', error: { message: 'User cancelled action command', code: -32000 } };
                //     }
                // }

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
