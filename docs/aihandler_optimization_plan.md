# AIHandler.ts Optimization Plan

## Overview
This document outlines optimization opportunities for improved AWS resource awareness and chat conversation management.

## Current State Analysis

### Strengths
- Basic resource tracking with `latestResources` object
- Token budget management with pruning
- Tool result truncation to prevent overflow
- Pagination support

### Limitations
1. **Resource Tracking**: Only one resource per type stored, loses conversation history
2. **No Resource Relationships**: AWS resources often relate (Lambda→CloudWatch, EC2→VPC) but not tracked
3. **Simple Pruning**: Drops all middle messages, loses important context
4. **Single Pagination Context**: Only tracks last pagination, loses multi-resource pagination
5. **Static Resource Context**: Resources injected only at conversation start

## Proposed Optimizations

### 1. Enhanced Resource Tracking

**Current**:
```typescript
private latestResources: {
  [type: string]: { type: string; name: string; arn?: string };
} = {};
```

**Proposed**:
```typescript
interface ResourceEntry {
  type: string;
  name: string;
  arn?: string;
  region?: string;
  timestamp: number;
  metadata?: Record<string, any>;
  relatedResources?: string[]; // Link to related resources
}

private resourceHistory: Map<string, ResourceEntry> = new Map();
private resourceAccessOrder: string[] = []; // LRU tracking
```

**Benefits**:
- Track multiple resources of same type
- Maintain access history with timestamps
- Link related resources (Lambda→CloudWatch logs)
- LRU eviction for memory management

### 2. Resource Relationship Inference

Add automatic relationship detection based on AWS conventions:

```typescript
private inferRelatedResources(resource: ResourceEntry): string[] {
  const related: string[] = [];
  
  // Lambda → CloudWatch Log Group
  if (resource.type === 'Lambda Function') {
    related.push(`CloudWatch Log Group:/aws/lambda/${resource.name}`);
  }
  
  // EC2 → VPC, Subnet, Security Groups
  if (resource.type === 'EC2 Instance' && resource.metadata) {
    if (resource.metadata.vpcId) related.push(`VPC:${resource.metadata.vpcId}`);
    if (resource.metadata.subnetId) related.push(`Subnet:${resource.metadata.subnetId}`);
  }
  
  // Glue Job → CloudWatch logs
  if (resource.type === 'Glue Job') {
    related.push(`CloudWatch Log Group:/aws-glue/jobs/output`);
  }
  
  return related;
}
```

**Benefits**:
- AI understands resource context better
- Suggests related resources automatically
- Improves troubleshooting workflows

### 3. Smarter Message Pruning

**Current Strategy**:
- Keep first message (system) + last N messages
- Loses important tool results and conversation context

**Proposed Strategy**:
```typescript
private pruneMessages(messages, maxTokens) {
  // 1. Keep system prompts
  // 2. Re-inject fresh resource context (may have updated)
  // 3. Keep recent user/assistant pairs (sliding window)
  // 4. Summarize large tool results instead of dropping
  
  return prunedMessages;
}
```

**Benefits**:
- Preserves conversation context better
- Updates resource context dynamically
- Summarizes instead of dropping important info

### 4. Multiple Pagination Contexts

**Current**:
```typescript
private paginationContext: { /* single context */ } | null = null;
```

**Proposed**:
```typescript
interface PaginationContext {
  toolName: string;
  command: string;
  params: any;
  paginationToken: string;
  tokenType: string;
  resourceKey?: string; // Link to resource
}

private paginationContexts: Map<string, PaginationContext> = new Map();
```

**Benefits**:
- Track pagination for multiple resources simultaneously
- Link pagination to specific resources
- Better multi-resource workflows

### 5. Contextual Resource Injection

**Current**: Resources added only at conversation start

**Proposed**: Refresh resource context before each model call

```typescript
private buildContextualMessages(messages) {
  // Remove stale resource context
  const withoutOldContext = messages.filter(m => !isResourceContext(m));
  
  // Inject fresh resource context
  const freshContext = this.getLatestResources(); // Hierarchical format
  
  return [...systemMessages, ...freshContext, ...conversationMessages];
}
```

**Benefits**:
- AI always has current resource state
- Better awareness of conversation progression
- More accurate responses

### 6. Resource-Aware Tool Results

Enhance tool result processing to extract and track resources automatically:

```typescript
private async executeToolCalls(toolCalls, messages) {
  for (const toolCall of toolCalls) {
    const result = await vscode.lm.invokeTool(toolCall.name, ...);
    
    // Auto-extract resources from result
    this.extractResourcesFromResult(result, toolCall.name);
    
    // Truncate intelligently (preserve structure)
    const truncated = this.smartTruncate(result);
    
    messages.push(toolResult(truncated));
  }
}
```

## Implementation Priority

### Phase 1: Foundation (High Value, Low Risk)
1. Enhanced resource tracking (Map-based storage)
2. LRU resource management
3. Resource relationship inference

### Phase 2: Context Management (High Value, Medium Risk)
4. Smarter message pruning
5. Dynamic resource context injection
6. Multiple pagination contexts

### Phase 3: Advanced Features (Medium Value, Medium Risk)
7. Resource-aware tool result processing
8. Automatic resource extraction from results
9. Conversation turn tracking

## Testing Strategy

1. **Unit Tests**: Test resource tracking logic, pruning strategies
2. **Integration Tests**: Test with real AWS API responses
3. **Performance Tests**: Measure token usage before/after
4. **User Testing**: Validate improved resource awareness in workflows

## Success Metrics

- **Resource Tracking**: 90%+ of related resources automatically identified
- **Token Efficiency**: 20-30% reduction in pruned context loss
- **User Feedback**: Improved "AI understands my resources" ratings
- **Conversation Length**: Support 2x longer conversations within token budget

## Risks & Mitigation

1. **Breaking Changes**: Phase implementation allows rollback
2. **Performance**: LRU caching limits memory growth
3. **Complexity**: Keep inferRelatedResources() simple, AWS-specific rules only
4. **Token Budget**: Monitor pruning effectiveness, adjust thresholds

## Future Enhancements

- **Resource Templates**: Learn common resource patterns per user
- **Cross-Service Intelligence**: "You modified Lambda X, should I check its CloudWatch logs?"
- **Conversation Summarization**: Compress old conversation turns instead of dropping
- **Resource Graph**: Build full dependency graph for complex architectures

## References

- AWS Resource Types: [AWS Documentation](https://docs.aws.amazon.com/)
- Token Optimization: Current model limits (Claude: 200k, GPT-4: 128k)
- LRU Cache: Standard cache eviction strategy
