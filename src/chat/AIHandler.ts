import * as vscode from "vscode";
import * as ui from "../common/UI";
import { Session } from "../common/Session";
import * as fs from "fs";
import * as path from "path";
import * as MessageHub from "../common/MessageHub";
import { encodingForModel } from "js-tiktoken";

const PARTICIPANT_ID = "awsflow.chat";
const DEFAULT_PROMPT = "What can you do to help me with AWS tasks?";

// Enhanced resource tracking with relationships and metadata
interface ResourceEntry {
  type: string;
  name: string;
  arn?: string;
  region?: string;
  timestamp: number;
  metadata?: Record<string, any>;
  relatedResources?: string[]; // References to other resource keys
}

interface PaginationContext {
  toolName: string;
  command: string;
  params: any;
  paginationToken: string;
  tokenType: string;
  resourceKey?: string; // Link pagination to specific resource
}

export class AIHandler {
  public static Current: AIHandler;

  // Token management constants
  private static readonly MAX_TOKEN_BUDGET_RATIO = 0.75; // Use 75% of model's max tokens
  private static readonly MAX_TOOL_RESULT_CHARS = 8000; // ~2000 tokens per result
  private static readonly MAX_RESOURCES_TO_KEEP = 10; // Increased for better context
  private static readonly SLIDING_WINDOW_SIZE = 12; // Keep last N messages in loop
  private static readonly RESOURCE_RELEVANCE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

  // Enhanced resource tracking with history
  private resourceHistory: Map<string, ResourceEntry> = new Map();
  private resourceAccessOrder: string[] = []; // Track access order for LRU
  
  // Track multiple pagination contexts by resource
  private paginationContexts: Map<string, PaginationContext> = new Map();
  
  // Track conversation turn for context relevance
  private conversationTurn: number = 0;
  
  constructor() {
    AIHandler.Current = this;
    this.registerChatParticipant();
  }

  /**
   * Update resource with relationship tracking
   */
  public updateLatestResource(resource: {
    type: string;
    name: string;
    arn?: string;
    region?: string;
    metadata?: Record<string, any>;
  }): void {
    const resourceKey = this.getResourceKey(resource.type, resource.name);
    
    const entry: ResourceEntry = {
      type: resource.type,
      name: resource.name,
      arn: resource.arn,
      region: resource.region,
      timestamp: Date.now(),
      metadata: resource.metadata,
      relatedResources: this.inferRelatedResources(resource)
    };
    
    this.resourceHistory.set(resourceKey, entry);
    
    // Update access order (LRU tracking)
    const existingIndex = this.resourceAccessOrder.indexOf(resourceKey);
    if (existingIndex !== -1) {
      this.resourceAccessOrder.splice(existingIndex, 1);
    }
    this.resourceAccessOrder.push(resourceKey);
    
    // Prune old resources
    this.pruneOldResources();
  }

  private getResourceKey(type: string, name: string): string {
    return `${type}:${name}`;
  }

  /**
   * Infer resource relationships based on AWS conventions
   */
  private inferRelatedResources(resource: { type: string; name: string; metadata?: Record<string, any> }): string[] {
    const related: string[] = [];
    const metadata = resource.metadata || {};
    
    // Lambda function → CloudWatch Log Group
    if (resource.type === 'Lambda Function') {
      related.push(`CloudWatch Log Group:/aws/lambda/${resource.name}`);
    }
    
    // CloudWatch Log Stream → Log Group
    if (resource.type === 'CloudWatch Log Stream' && metadata.logGroupName) {
      related.push(`CloudWatch Log Group:${metadata.logGroupName}`);
    }
    
    // Glue Job → CloudWatch Log Group
    if (resource.type === 'Glue Job') {
      related.push(`CloudWatch Log Group:/aws-glue/jobs/output`);
    }
    
    // Step Function → CloudWatch Log Group
    if (resource.type === 'Step Function Execution' && metadata.stateMachineArn) {
      related.push(`Step Function State Machine:${metadata.stateMachineArn}`);
    }
    
    // EC2 Instance → VPC, Subnet, Security Groups
    if (resource.type === 'EC2 Instance') {
      if (metadata.vpcId) { related.push(`VPC:${metadata.vpcId}`); }
      if (metadata.subnetId) { related.push(`Subnet:${metadata.subnetId}`); }
      if (metadata.securityGroups) {
        metadata.securityGroups.forEach((sg: string) => related.push(`Security Group:${sg}`));
      }
    }
    
    return related;
  }

  /**
   * Prune resources older than relevance window and beyond max count
   */
  private pruneOldResources(): void {
    const now = Date.now();
    const maxAge = AIHandler.RESOURCE_RELEVANCE_WINDOW_MS;
    
    // Remove stale resources
    for (const [key, resource] of this.resourceHistory.entries()) {
      if (now - resource.timestamp > maxAge) {
        this.resourceHistory.delete(key);
        const index = this.resourceAccessOrder.indexOf(key);
        if (index !== -1) {
          this.resourceAccessOrder.splice(index, 1);
        }
      }
    }
    
    // Keep only most recent resources if over limit
    while (this.resourceAccessOrder.length > AIHandler.MAX_RESOURCES_TO_KEEP) {
      const oldestKey = this.resourceAccessOrder.shift();
      if (oldestKey) {
        this.resourceHistory.delete(oldestKey);
      }
    }
  }

  /**
   * Build contextual resource summary with relationships
   */
  private getLatestResources(): vscode.LanguageModelChatMessage[] {
    if (this.resourceHistory.size === 0) {
      return [];
    }

    // Get recent resources in access order
    const recentKeys = this.resourceAccessOrder.slice(-5);
    const recentResources = recentKeys
      .map(key => this.resourceHistory.get(key))
      .filter((r): r is ResourceEntry => r !== undefined);
    
    if (recentResources.length === 0) {
      return [];
    }
    
    // Build hierarchical context
    const contextLines: string[] = [];
    const processedKeys = new Set<string>();
    
    for (const resource of recentResources) {
      const key = this.getResourceKey(resource.type, resource.name);
      if (processedKeys.has(key)) { continue; }
      
      let line = `- ${resource.type}: ${resource.name}`;
      if (resource.arn) { line += ` (${resource.arn})`; }
      if (resource.region) { line += ` [${resource.region}]`; }
      
      contextLines.push(line);
      processedKeys.add(key);
      
      // Add related resources if they exist
      if (resource.relatedResources && resource.relatedResources.length > 0) {
        for (const relatedKey of resource.relatedResources) {
          if (processedKeys.has(relatedKey)) { continue; }
          
          const related = this.resourceHistory.get(relatedKey);
          if (related) {
            contextLines.push(`  └─ ${related.type}: ${related.name}`);
            processedKeys.add(relatedKey);
          }
        }
      }
    }
    
    const contextMessage = `Recent AWS resources in this conversation:\n${contextLines.join('\n')}`;
    
    return [
      vscode.LanguageModelChatMessage.User(contextMessage)
    ];
  }

  public registerChatParticipant(): void {
    const participant = vscode.chat.createChatParticipant(
      PARTICIPANT_ID,
      this.aIHandler.bind(AIHandler.Current)
    );
    if (!Session.Current) {
      return;
    }

    const context: vscode.ExtensionContext = Session.Current?.Context;
    participant.iconPath = vscode.Uri.joinPath(
      context.extensionUri,
      "media",
      "extension",
      "chat-icon.png"
    );
    context.subscriptions.push(participant);
  }

  public async aIHandler(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
  ): Promise<void> {
    MessageHub.StartWorking();

    let workingEnded = false;
    const endWorkingOnce = () => {
      if (workingEnded) {
        return;
      }
      workingEnded = true;
      MessageHub.EndWorking();
    };
    const cancelListener = token.onCancellationRequested(endWorkingOnce);

    // Capture assistant response
    let assistantResponse = "";
    const wrappedStream = {
      markdown: (value: string | vscode.MarkdownString) => {
        assistantResponse += typeof value === "string" ? value : value.value;
        return stream.markdown(value);
      },
      progress: (value: string) => stream.progress(value),
      button: (command: vscode.Command) => stream.button(command),
      filetree: (value: vscode.ChatResponseFileTree[], baseUri: vscode.Uri) =>
        stream.filetree(value, baseUri),
      reference: (
        value: vscode.Uri | vscode.Location,
        iconPath?: vscode.Uri | vscode.ThemeIcon | undefined
      ) => stream.reference(value, iconPath),
      anchor: (value: vscode.Uri, title?: string | undefined) =>
        stream.anchor(value, title),
      push: (part: vscode.ChatResponsePart) => stream.push(part),
    } as vscode.ChatResponseStream;

    try {
      const tools: vscode.LanguageModelChatTool[] = this.getToolsFromPackageJson();
      const messages: vscode.LanguageModelChatMessage[] = this.buildInitialMessages(request, context);
      const usedAppreciated = request.prompt.toLowerCase().includes("thank");
      const defaultPromptUsed = request.prompt === DEFAULT_PROMPT;

      const [model] = await vscode.lm.selectChatModels();
      if (!model) {
        wrappedStream.markdown("No suitable AI model found.");
        endWorkingOnce();
        return;
      }
      ui.logToOutput(`AIHandler: Using model ${model.family} (${model.name})`);
      //ui.logToOutput(`AIHandler: Initial messages: ${JSON.stringify(messages)}`);

      await this.runToolCallingLoop(
        model,
        messages,
        tools,
        wrappedStream,
        token
      );
      
      this.renderResponseButtons(wrappedStream);

      if (usedAppreciated || defaultPromptUsed) {
        this.renderAppreciationMessage(wrappedStream);
      }

      endWorkingOnce();
    } catch (err) {
      this.handleError(err, wrappedStream);
      endWorkingOnce();
    } finally {
      cancelListener.dispose();
    }
  }

  private buildInitialMessages(
    request: vscode.ChatRequest,
    chatContext: vscode.ChatContext
  ): vscode.LanguageModelChatMessage[] {
    const messages: vscode.LanguageModelChatMessage[] = [];

    messages.push(vscode.LanguageModelChatMessage.User(`AWS Expert: Use tools for tasks. Respond in Markdown; no JSON unless requested.`));

    // Add summarized resources
    messages.push(...this.getLatestResources());

    messages.push(vscode.LanguageModelChatMessage.User(request.prompt));
    return messages;
  }

  /**
   * Estimate token count for messages (rough approximation)
   * More accurate than character count, less overhead than full tokenization
   */
  private estimateTokenCount(messages: vscode.LanguageModelChatMessage[]): number {
    let totalChars = 0;
    
    for (const message of messages) {
      const content = message.content as string | vscode.LanguageModelTextPart[];
      if (typeof content === 'string') 
      {
        totalChars += content.length;
      } else if (Array.isArray(content)) {
        for (const part of content) {
          if (part instanceof vscode.LanguageModelTextPart) {
            totalChars += part.value.length;
          }
        }
      }
    }
    
    // Rough estimate: 1 token ≈ 4 characters for English text
    // Add 10% overhead for message structure
    return Math.ceil(totalChars / 4 * 1.1);
  }

  /**
   * Get max tokens based on model family
   */
  private getModelMaxTokens(model: vscode.LanguageModelChat): number {
    // Default context windows for common model families
    const family = model.family.toLowerCase();
    
    if (family.includes('claude')) {
      return 200000; // Claude 3.5 Sonnet has 200k context
    } else if (family.includes('gpt-4')) {
      return 128000; // GPT-4 Turbo
    } else if (family.includes('gpt-3.5')) {
      return 16000;
    }
    
    // Conservative default
    return 8000;
  }

  /**
   * Prune messages to fit within token budget
   * Preserves: system prompt + resource context + recent user/assistant pairs
   */
  private pruneMessages(
    messages: vscode.LanguageModelChatMessage[],
    maxTokens: number
  ): vscode.LanguageModelChatMessage[] {
    const estimatedTokens = this.estimateTokenCount(messages);
    
    if (estimatedTokens <= maxTokens) {
      return messages;
    }

    ui.logToOutput(`AIHandler: Pruning messages - ${estimatedTokens} tokens exceeds ${maxTokens}`);

    // Identify message types
    const systemPromptEnd = this.findSystemPromptEnd(messages);
    const resourceContextEnd = this.findResourceContextEnd(messages, systemPromptEnd);
    
    // Preserve: system + resource context + recent conversation
    const systemAndContext = messages.slice(0, resourceContextEnd);
    const recentPairs = this.getRecentMessagePairs(messages.slice(resourceContextEnd), AIHandler.SLIDING_WINDOW_SIZE);
    
    const prunedMessages = [...systemAndContext, ...recentPairs];
    const newTokenCount = this.estimateTokenCount(prunedMessages);
    
    // If still too large, try aggressive pruning
    if (newTokenCount > maxTokens) {
      ui.logToOutput(`AIHandler: Standard pruning insufficient (${newTokenCount} tokens), using aggressive mode`);
      return this.aggressivePrune(messages, maxTokens);
    }
    
    ui.logToOutput(`AIHandler: After pruning - ${newTokenCount} tokens (from ${estimatedTokens})`);
    
    return prunedMessages;
  }

  /**
   * Find where system prompt ends (usually first 1-2 messages)
   */
  private findSystemPromptEnd(messages: vscode.LanguageModelChatMessage[]): number {
    // System prompt is typically the first user message
    return Math.min(1, messages.length);
  }

  /**
   * Find where resource context ends (messages after system prompt that describe resources)
   */
  private findResourceContextEnd(messages: vscode.LanguageModelChatMessage[], startIdx: number): number {
    // Resource context is the messages immediately after system that contain "Recent AWS resources"
    for (let i = startIdx; i < Math.min(startIdx + 3, messages.length); i++) {
      const text = this.getMessageText(messages[i]);
      if (text.includes('Recent AWS resources')) {
        return i + 1;
      }
    }
    return startIdx;
  }

  /**
   * Get recent message pairs (user question + assistant response + tool results)
   */
  private getRecentMessagePairs(
    messages: vscode.LanguageModelChatMessage[],
    maxMessages: number
  ): vscode.LanguageModelChatMessage[] {
    // Keep complete conversation pairs to maintain context
    // Each "pair" can be: User question -> Assistant (with tool calls) -> Tool results
    
    if (messages.length <= maxMessages) {
      return messages;
    }
    
    // Take last N messages, trying to keep pairs complete
    const recent = messages.slice(-maxMessages);
    
    // If first message is Assistant response, try to include the preceding User message
    if (recent.length > 0 && recent[0].role === vscode.LanguageModelChatMessageRole.Assistant) {
      const precedingIdx = messages.length - maxMessages - 1;
      if (precedingIdx >= 0 && messages[precedingIdx].role === vscode.LanguageModelChatMessageRole.User) {
        return [messages[precedingIdx], ...recent];
      }
    }
    
    return recent;
  }

  /**
   * Aggressive pruning when standard approach still exceeds budget
   * Keeps only: system prompt + last user message + last assistant response
   */
  private aggressivePrune(
    messages: vscode.LanguageModelChatMessage[],
    maxTokens: number
  ): vscode.LanguageModelChatMessage[] {
    // Absolute minimum: system + last exchange
    const systemPrompt = messages.slice(0, 1);
    const lastMessages = messages.slice(-3); // Last user + assistant + tool result
    
    const minimal = [...systemPrompt, ...lastMessages];
    const minimalTokens = this.estimateTokenCount(minimal);
    
    if (minimalTokens > maxTokens) {
      ui.logToOutput(`AIHandler: WARNING - Even minimal context (${minimalTokens} tokens) exceeds budget!`);
    }
    
    ui.logToOutput(`AIHandler: Aggressive pruning - ${minimalTokens} tokens`);
    return minimal;
  }

  /**
   * Extract text content from a message for analysis
   */
  private getMessageText(message: vscode.LanguageModelChatMessage): string {
    const content = message.content;
    
    if (typeof content === 'string') {
      return content;
    }
    
    if (Array.isArray(content)) {
      return content
        .map(part => {
          if (part instanceof vscode.LanguageModelTextPart) {
            return part.value;
          }
          return '';
        })
        .join(' ');
    }
    
    return '';
  }

  private async runToolCallingLoop(
    model: vscode.LanguageModelChat,
    messages: vscode.LanguageModelChatMessage[],
    tools: vscode.LanguageModelChatTool[],
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
  ): Promise<void> {
    const modelMaxTokens = this.getModelMaxTokens(model);
    const tokenBudget = Math.floor(modelMaxTokens * AIHandler.MAX_TOKEN_BUDGET_RATIO);
    
    ui.logToOutput(`AIHandler: Token budget set to ${tokenBudget} (${Math.floor(AIHandler.MAX_TOKEN_BUDGET_RATIO * 100)}% of ${modelMaxTokens})`);

    let keepGoing = true;
    while (keepGoing && !token.isCancellationRequested) {
      keepGoing = false;

      // Prune messages before sending to stay within token budget
      const prunedMessages = this.pruneMessages(messages, tokenBudget);

      const chatResponse = await model.sendRequest(prunedMessages, { tools }, token);
      const toolCalls = await this.collectToolCalls(chatResponse, stream);

      if (toolCalls.length > 0) {
        keepGoing = true;
        messages.push(vscode.LanguageModelChatMessage.Assistant(toolCalls));
        await this.executeToolCalls(toolCalls, messages, stream, token);
      }
    }
  }

  private async collectToolCalls(
    chatResponse: vscode.LanguageModelChatResponse,
    stream: vscode.ChatResponseStream
  ): Promise<vscode.LanguageModelToolCallPart[]> {
    // Stream the markdown response
    for await (const fragment of chatResponse.text) {
      stream.markdown(fragment);
    }

    // Collect tool calls from the response
    const toolCalls: vscode.LanguageModelToolCallPart[] = [];
    for await (const part of chatResponse.stream) {
      if (part instanceof vscode.LanguageModelToolCallPart) {
        toolCalls.push(part);
      }
    }
    return toolCalls;
  }

  private async executeToolCalls(
    toolCalls: vscode.LanguageModelToolCallPart[],
    messages: vscode.LanguageModelChatMessage[],
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
  ): Promise<void> {
    for (const toolCall of toolCalls) {
      let prompt = `Calling : ${toolCall.name}`;
      if (toolCall.input && 'command' in toolCall.input) {
        prompt += ` (${toolCall.input['command']})`;
      }      
      stream.progress(prompt);


      ui.logToOutput(`AIHandler: Invoking tool ${toolCall.name} with input: ${JSON.stringify(toolCall.input)}`);

      try {
        const result = await vscode.lm.invokeTool(
          toolCall.name,
          { input: toolCall.input } as any,
          token
        );

        const resultText = this.extractResultText(result);
        this.checkForPaginationToken(resultText, toolCall);
        
        // Auto-extract resources from tool results
        this.autoExtractResources(resultText, toolCall);

        messages.push(
          vscode.LanguageModelChatMessage.User([
            new vscode.LanguageModelToolResultPart(toolCall.callId, [
              new vscode.LanguageModelTextPart(resultText),
            ]),
          ])
        );
      } catch (err) {
        const errorMessage = `Tool execution failed: ${
          err instanceof Error ? err.message : String(err)
        }`;
        ui.logToOutput(`AIHandler: ${errorMessage}`);
        messages.push(
          vscode.LanguageModelChatMessage.User([
            new vscode.LanguageModelToolResultPart(toolCall.callId, [
              new vscode.LanguageModelTextPart(errorMessage),
            ]),
          ])
        );
      } finally {
        MessageHub.StartWorking();
      }
    }
  }

  private extractResultText(result: vscode.LanguageModelToolResult): string {
    const fullText = result.content
      .filter((part) => part instanceof vscode.LanguageModelTextPart)
      .map((part) => (part as vscode.LanguageModelTextPart).value)
      .join("\n");
    
    return this.truncateToolResult(fullText);
  }

  /**
   * Truncate large tool results to prevent token overflow
   * Preserves JSON structure when possible
   */
  private truncateToolResult(resultText: string): string {
    if (resultText.length <= AIHandler.MAX_TOOL_RESULT_CHARS) {
      return resultText;
    }

    ui.logToOutput(`AIHandler: Truncating tool result from ${resultText.length} to ${AIHandler.MAX_TOOL_RESULT_CHARS} chars`);

    // Try to parse as JSON and truncate intelligently
    try {
      const parsed = JSON.parse(resultText);
      
      // If it has an array of items, truncate the array
      if (parsed.items && Array.isArray(parsed.items)) {
        const originalCount = parsed.items.length;
        const maxItems = 10; // Keep first 10 items
        
        if (originalCount > maxItems) {
          parsed.items = parsed.items.slice(0, maxItems);
          parsed.truncated = true;
          parsed.totalItems = originalCount;
          parsed.showingItems = maxItems;
          
          const truncatedJson = JSON.stringify(parsed, null, 2);
          return truncatedJson + `\n\n... (Showing ${maxItems} of ${originalCount} items)`;
        }
      }
      
      // If still too large, do simple truncation on stringified version
      const stringified = JSON.stringify(parsed, null, 2);
      if (stringified.length > AIHandler.MAX_TOOL_RESULT_CHARS) {
        return stringified.slice(0, AIHandler.MAX_TOOL_RESULT_CHARS) + 
               `\n... (truncated from ${stringified.length} chars)`;
      }
      
      return stringified;
    } catch (e) {
      // Not JSON, do simple text truncation
      return resultText.slice(0, AIHandler.MAX_TOOL_RESULT_CHARS) + 
             `\n... (truncated from ${resultText.length} chars)`;
    }
  }

  private checkForPaginationToken(
    resultText: string,
    toolCall: vscode.LanguageModelToolCallPart
  ): void {
    try {
      const parsedResponse = JSON.parse(resultText);
      if (parsedResponse?.pagination?.hasMore) {
        const pagination = parsedResponse.pagination;
        const tokenType = Object.keys(pagination).find(
          (k) => k.endsWith("Token") && k !== "hasMore"
        );
        if (tokenType && pagination[tokenType]) {
          const input = toolCall.input as any;
          const contextKey = `${toolCall.name}:${input.command}`;
          this.paginationContexts.set(contextKey, {
            toolName: toolCall.name,
            command: input.command,
            params: input.params || {},
            paginationToken: pagination[tokenType],
            tokenType: tokenType,
            resourceKey: this.getResourceKeyFromParams(input.params || {})
          });
        }
      }
    } catch (parseErr) {
      // If response is not JSON, ignore pagination detection
    }
  }

  /**
   * Automatically extract resources from tool result JSON
   * Detects common AWS resource patterns in tool responses
   */
  private autoExtractResources(resultText: string, toolCall: vscode.LanguageModelToolCallPart): void {
    try {
      const parsed = JSON.parse(resultText);
      const input = toolCall.input as any;
      const command = input.command;
      const params = input.params || {};
      
      // Extract based on tool type and command
      this.extractResourcesByToolType(toolCall.name, command, params, parsed);
    } catch (err) {
      // Not JSON or parsing failed - skip auto-extraction
    }
  }

  /**
   * Extract resources based on AWS tool type and response structure
   */
  private extractResourcesByToolType(
    toolName: string,
    command: string,
    params: any,
    response: any
  ): void {
    const region = Session.Current?.AwsRegion;
    
    // S3 Tool
    if (toolName === 'S3Tool') {
      if (params.bucketName) {
        this.updateLatestResource({
          type: 'S3 Bucket',
          name: params.bucketName,
          region,
          metadata: { command }
        });
      }
      if (params.key && params.bucketName) {
        this.updateLatestResource({
          type: 'S3 Object',
          name: params.key,
          region,
          metadata: { bucketName: params.bucketName, command }
        });
      }
    }
    
    // Lambda Tool
    if (toolName === 'LambdaTool') {
      if (params.functionName) {
        this.updateLatestResource({
          type: 'Lambda Function',
          name: params.functionName,
          arn: response.FunctionArn || response.Configuration?.FunctionArn,
          region,
          metadata: { command, runtime: response.Runtime || response.Configuration?.Runtime }
        });
      }
      // Extract event source mappings
      if (command === 'listEventSourceMappings' && response.EventSourceMappings) {
        response.EventSourceMappings.forEach((mapping: any) => {
          if (mapping.FunctionArn) {
            const funcName = mapping.FunctionArn.split(':').pop();
            this.updateLatestResource({
              type: 'Lambda Function',
              name: funcName,
              arn: mapping.FunctionArn,
              region,
              metadata: { command, eventSourceArn: mapping.EventSourceArn }
            });
          }
        });
      }
    }
    
    // CloudWatch Tool
    if (toolName === 'CloudWatchLogTool') {
      if (params.logGroupName) {
        this.updateLatestResource({
          type: 'CloudWatch Log Group',
          name: params.logGroupName,
          region,
          metadata: { command }
        });
      }
      if (params.logStreamName && params.logGroupName) {
        this.updateLatestResource({
          type: 'CloudWatch Log Stream',
          name: params.logStreamName,
          region,
          metadata: { logGroupName: params.logGroupName, command }
        });
      }
    }
    
    // DynamoDB Tool
    if (toolName === 'DynamoDBTool') {
      if (params.tableName) {
        this.updateLatestResource({
          type: 'DynamoDB Table',
          name: params.tableName,
          arn: response.Table?.TableArn,
          region,
          metadata: { command, itemCount: response.Table?.ItemCount }
        });
      }
    }
    
    // EC2 Tool
    if (toolName === 'EC2Tool') {
      // Extract instances
      if (response.Reservations) {
        response.Reservations.forEach((reservation: any) => {
          reservation.Instances?.forEach((instance: any) => {
            this.updateLatestResource({
              type: 'EC2 Instance',
              name: instance.InstanceId,
              region,
              metadata: {
                command,
                vpcId: instance.VpcId,
                subnetId: instance.SubnetId,
                securityGroups: instance.SecurityGroups?.map((sg: any) => sg.GroupId),
                state: instance.State?.Name
              }
            });
          });
        });
      }
      // Extract VPCs
      if (response.Vpcs) {
        response.Vpcs.forEach((vpc: any) => {
          this.updateLatestResource({
            type: 'VPC',
            name: vpc.VpcId,
            region,
            metadata: { command, cidrBlock: vpc.CidrBlock, isDefault: vpc.IsDefault }
          });
        });
      }
      // Extract Security Groups
      if (response.SecurityGroups) {
        response.SecurityGroups.forEach((sg: any) => {
          this.updateLatestResource({
            type: 'Security Group',
            name: sg.GroupId,
            region,
            metadata: { command, vpcId: sg.VpcId, groupName: sg.GroupName }
          });
        });
      }
    }
    
    // Glue Tool
    if (toolName === 'GlueTool') {
      if (params.jobName) {
        this.updateLatestResource({
          type: 'Glue Job',
          name: params.jobName,
          region,
          metadata: { command }
        });
      }
      if (params.databaseName) {
        this.updateLatestResource({
          type: 'Glue Database',
          name: params.databaseName,
          region,
          metadata: { command }
        });
      }
      if (params.tableName && params.databaseName) {
        this.updateLatestResource({
          type: 'Glue Table',
          name: `${params.databaseName}.${params.tableName}`,
          region,
          metadata: { command, databaseName: params.databaseName }
        });
      }
    }
    
    // Step Functions Tool
    if (toolName === 'StepFuncTool') {
      if (params.stateMachineArn) {
        const name = params.stateMachineArn.split(':').pop();
        this.updateLatestResource({
          type: 'Step Function State Machine',
          name,
          arn: params.stateMachineArn,
          region,
          metadata: { command }
        });
      }
      if (params.executionArn) {
        const name = params.executionArn.split(':').pop();
        this.updateLatestResource({
          type: 'Step Function Execution',
          name,
          arn: params.executionArn,
          region,
          metadata: { command, stateMachineArn: response.stateMachineArn }
        });
      }
    }
    
    // IAM Tool
    if (toolName === 'IAMTool') {
      if (params.userName) {
        this.updateLatestResource({
          type: 'IAM User',
          name: params.userName,
          arn: response.User?.Arn,
          metadata: { command }
        });
      }
      if (params.roleName) {
        this.updateLatestResource({
          type: 'IAM Role',
          name: params.roleName,
          arn: response.Role?.Arn,
          metadata: { command }
        });
      }
    }
    
    // SQS Tool
    if (toolName === 'SQSTool') {
      if (params.queueUrl) {
        const name = params.queueUrl.split('/').pop() || params.queueUrl;
        this.updateLatestResource({
          type: 'SQS Queue',
          name,
          region,
          metadata: { command, queueUrl: params.queueUrl }
        });
      }
    }
    
    // SNS Tool
    if (toolName === 'SNSTool') {
      if (params.topicArn) {
        const name = params.topicArn.split(':').pop();
        this.updateLatestResource({
          type: 'SNS Topic',
          name,
          arn: params.topicArn,
          region,
          metadata: { command }
        });
      }
    }
  }

  /**
   * Extract resource key from tool call params (for linking pagination)
   */
  private getResourceKeyFromParams(params: any): string | undefined {
    // S3
    if (params.bucketName) {
      return `S3 Bucket:${params.bucketName}`;
    }
    // Lambda
    if (params.functionName) {
      return `Lambda Function:${params.functionName}`;
    }
    // CloudWatch
    if (params.logGroupName) {
      return `CloudWatch Log Group:${params.logGroupName}`;
    }
    // DynamoDB
    if (params.tableName) {
      return `DynamoDB Table:${params.tableName}`;
    }
    // Glue
    if (params.jobName) {
      return `Glue Job:${params.jobName}`;
    }
    if (params.databaseName) {
      return `Glue Database:${params.databaseName}`;
    }
    // Step Functions
    if (params.stateMachineArn) {
      return `Step Function State Machine:${params.stateMachineArn}`;
    }
    
    return undefined;
  }

  /**
   * Find most recent resource of a specific type
   */
  private findResourceByType(type: string): ResourceEntry | undefined {
    // Search in reverse order (most recent first)
    for (let i = this.resourceAccessOrder.length - 1; i >= 0; i--) {
      const key = this.resourceAccessOrder[i];
      const resource = this.resourceHistory.get(key);
      if (resource && resource.type === type) {
        return resource;
      }
    }
    return undefined;
  }

  private renderResponseButtons(stream: vscode.ChatResponseStream): void {
    this.renderCloudWatchButton(stream);
    this.renderS3Button(stream);
    this.renderPaginationButton(stream);
  }

  private renderCloudWatchButton(stream: vscode.ChatResponseStream): void {
    const logGroup = this.findResourceByType("CloudWatch Log Group");
    if (!logGroup) {
      return;
    }

    const logStream = this.findResourceByType("CloudWatch Log Stream");

    stream.markdown("\n\n");
    stream.button({
      command: "awsflow.OpenCloudWatchView",
      title: "Open Log View",
      arguments: logStream ? [logGroup.name, logStream.name] : [logGroup.name],
    });
  }

  private renderS3Button(stream: vscode.ChatResponseStream): void {
    const bucket = this.findResourceByType("S3 Bucket");
    if (!bucket) {
      return;
    }

    stream.markdown("\n\n");
    stream.button({
      command: "awsflow.OpenS3ExplorerView",
      title: "Open S3 View",
      arguments: [bucket.name],
    });
  }

  private renderPaginationButton(stream: vscode.ChatResponseStream): void {
    // Get most recent pagination context
    if (this.paginationContexts.size === 0) {
      return;
    }

    const contexts = Array.from(this.paginationContexts.values());
    const mostRecent = contexts[contexts.length - 1];
    if (!mostRecent) {
      return;
    }

    stream.markdown("\n\n");
    stream.button({
      command: "awsflow.LoadMoreResults",
      title: "Load More",
      arguments: [mostRecent],
    });
  }

  private renderAppreciationMessage(stream: vscode.ChatResponseStream): void {
    stream.markdown("\n\n\n");
    stream.markdown(
      "\n🙏 [Donate](https://github.com/sponsors/necatiarslan) if you found me useful!"
    );
    stream.markdown(
      "\n🤔 [New Feature](https://github.com/necatiarslan/awsflow/issues/new) Request"
    );
  }

  private handleError(err: unknown, stream: vscode.ChatResponseStream): void {
    if (err instanceof Error) {
      stream.markdown(
        `I'm sorry, I couldn't connect to the AI model: ${err.message}`
      );
    } else {
      stream.markdown("I'm sorry, I couldn't connect to the AI model.");
    }
    stream.markdown(
      "\n🪲 Please [Report an Issue](https://github.com/necatiarslan/awsflow/issues/new)"
    );
  }

  public async isChatCommandAvailable(): Promise<boolean> {
    const commands = await vscode.commands.getCommands(true); // 'true' includes internal commands
    return commands.includes("workbench.action.chat.open");
  }

  public async askAI(prompt?: string): Promise<void> {
    ui.logToOutput("AIHandler.askAI Started");

    if (!(await this.isChatCommandAvailable())) {
      ui.showErrorMessage(
        "Chat command is not available. Please ensure you have access to VS Code AI features.",
        undefined
      );
      return;
    }

    const commandId = this.getCommandIdForEnvironment();
    await vscode.commands.executeCommand(commandId, {
      query: "@aws " + (prompt || DEFAULT_PROMPT),
    });
  }

  private getCommandIdForEnvironment(): string {
    const appName = vscode.env.appName;

    if (appName.includes("Antigravity")) {
      return "antigravity.startAgentTask";
    } else if (
      appName.includes("Code - OSS") ||
      appName.includes("Visual Studio Code")
    ) {
      return "workbench.action.chat.open";
    }

    return "workbench.action.chat.open";
  }

  private getToolsFromPackageJson(): vscode.LanguageModelChatTool[] {
    try {
      const packageJsonPath = path.join(__dirname, "../../package.json");
      const raw = fs.readFileSync(packageJsonPath, "utf8");
      const pkg = JSON.parse(raw) as any;
      const lmTools = pkg?.contributes?.languageModelTools as any[] | undefined;

      if (!Array.isArray(lmTools)) {
        ui.logToOutput(
          "AIHandler: No languageModelTools found in package.json"
        );
        return [];
      }

      return lmTools.map(
        (tool) =>
          ({
            name: tool.name,
            description:
              tool.modelDescription ||
              tool.userDescription ||
              tool.displayName ||
              "Tool",
            inputSchema: tool.inputSchema ?? { type: "object" },
          } satisfies vscode.LanguageModelChatTool)
      );
    } catch (err) {
      ui.logToOutput(
        "AIHandler: Failed to load tools from package.json",
        err instanceof Error ? err : undefined
      );
      return [];
    }
  }
}
