import * as vscode from 'vscode';
import { Session } from './Session';

export function needsConfirmation(command: string): boolean {
  const c = command.toLowerCase();
  return (
    c.startsWith('put') ||
    c.startsWith('post') ||
    c.startsWith('upload') ||
    c.startsWith('download') ||
    c.startsWith('delete') ||
    c.startsWith('copy') ||
    c.startsWith('create') ||
    c.startsWith('update') ||
    c.startsWith('insert') ||
    c.startsWith('commit') ||
    c.startsWith('rollback') ||
    c.startsWith('send') ||
    c.startsWith('publish') ||
    c.startsWith('invoke') ||
    c.startsWith('start') ||
    c.startsWith('stop') ||
    c.startsWith('execute') ||
    c.startsWith('receive') ||
    c.startsWith('remove') ||
    c.startsWith('write') ||
    c.startsWith('append') ||
    c.startsWith('tag') ||
    c.startsWith('untag') ||
    c.startsWith('add') ||
    c.startsWith('attach') ||
    c.startsWith('detach') ||
    c.startsWith('enable') ||
    c.startsWith('disable') ||
    c.startsWith('grant') ||
    c.startsWith('revoke') ||
    c.startsWith('set') ||
    c.startsWith('associate') ||
    c.startsWith('disassociate') ||
    c.startsWith('import') ||
    c.startsWith('export') ||
    c.startsWith('register') ||
    c.startsWith('deregister') ||
    c.startsWith('allocate') ||
    c.startsWith('deallocate') ||
    c.startsWith('approve') ||
    c.startsWith('reject') ||
    c.startsWith('confirm') ||
    c.startsWith('cancel')
  );
}

export async function confirmProceed(command: string, params?: Record<string, any>): Promise<boolean> {
  if (Session.Current?.AwsReadonlyMode) {
    vscode.window.showWarningMessage('Action commands are disabled in AWS Readonly Mode.');
    return false;
  }
  
  let message = `Confirm to execute action command: ${command}`;
  if (params && Object.keys(params).length > 0) {
    message += '\n\nParameters:\n';
    for (let [key, value] of Object.entries(params)) {
      if (key == 'Body'){
        value = '[...]';
      } else if (value.length > 100) {
        value = `${value.substring(0, 10)}...`;
      }
      message += `${key}: ${value}\n`;
    }
  }
  const selection = await vscode.window.showWarningMessage(
    message,
    { modal: true },
    'Proceed',
    'Cancel'
  );
  return selection === 'Proceed';
}
