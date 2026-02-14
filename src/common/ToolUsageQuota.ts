import * as vscode from 'vscode';

export interface DailyUsageStatus {
    count: number;
    limit: number;
    remaining: number;
    date: string;
}

interface UsageRecord {
    date: string;
    count: number;
}

const DAILY_LIMIT = 20;
const USAGE_KEY = 'awsflow.dailyToolUsage';
const EXEMPT_TOOLS = new Set<string>([
    'SessionTool',
    'FileOperationsTool',
    'TestAwsConnectionTool'
]);

function getLocalDateKey(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function buildStatus(record: UsageRecord): DailyUsageStatus {
    const remaining = Math.max(DAILY_LIMIT - record.count, 0);
    return {
        count: record.count,
        limit: DAILY_LIMIT,
        remaining,
        date: record.date
    };
}

async function getOrResetUsageRecord(context: vscode.ExtensionContext): Promise<UsageRecord> {
    const today = getLocalDateKey();
    const stored = context.globalState.get<UsageRecord | null>(USAGE_KEY, null);
    if (stored && stored.date === today) {
        return stored;
    }
    const reset = { date: today, count: 0 };
    await context.globalState.update(USAGE_KEY, reset);
    return reset;
}

export function isToolExempt(toolName: string): boolean {
    return EXEMPT_TOOLS.has(toolName);
}

export async function getDailyUsageStatus(context: vscode.ExtensionContext): Promise<DailyUsageStatus> {
    const record = await getOrResetUsageRecord(context);
    return buildStatus(record);
}

export async function consumeToolInvocation(
    context: vscode.ExtensionContext,
    toolName: string
): Promise<{ allowed: boolean; status: DailyUsageStatus }>
{
    const record = await getOrResetUsageRecord(context);
    if (isToolExempt(toolName)) {
        return { allowed: true, status: buildStatus(record) };
    }

    if (record.count >= DAILY_LIMIT) {
        return { allowed: false, status: buildStatus(record) };
    }

    const updated: UsageRecord = { ...record, count: record.count + 1 };
    await context.globalState.update(USAGE_KEY, updated);
    return { allowed: true, status: buildStatus(updated) };
}

export function getDailyLimit(): number {
    return DAILY_LIMIT;
}
