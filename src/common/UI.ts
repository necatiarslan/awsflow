import * as vscode from 'vscode';
import { readFileSync } from 'fs';
import { join } from 'path';
import { MethodResult } from './MethodResult';

let outputChannel: vscode.OutputChannel | undefined;
let logsOutputChannel: vscode.OutputChannel | undefined;

const NEW_LINE: string = "\n\n";

export function showOutputMessage(message: any, popupMessage: string = "Results are printed to OUTPUT / Awsflow-Extension", clearPrevMessages: boolean = true): void {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel("Awsflow-Extension");
  }

  if (clearPrevMessages) {
    outputChannel.clear();
  }

  if (typeof message === "object") {
    outputChannel.appendLine(JSON.stringify(message, null, 4));
  }
  else {
    outputChannel.appendLine(message);
  }
  outputChannel.show();

  if (popupMessage.length > 0) {
    showInfoMessage(popupMessage);
  }
}

export function logToOutput(message: any, error?: Error): void {
  const now = new Date().toLocaleString();

  if (!logsOutputChannel) {
    logsOutputChannel = vscode.window.createOutputChannel("Awsflow-Log");
  }

  if (typeof message === "object") {
    logsOutputChannel.appendLine("[" + now + "] " + JSON.stringify(message, null, 4));
  }
  else {
    logsOutputChannel.appendLine("[" + now + "] " + message);
  }

  if (error) {
    logsOutputChannel.appendLine(error.name);
    logsOutputChannel.appendLine(error.message);
    if (error.stack) {
      logsOutputChannel.appendLine(error.stack);
    }
  }
}

export function showInfoMessage(message: string): void {
  vscode.window.showInformationMessage(message);
}

export function showWarningMessage(message: string): void {
  vscode.window.showWarningMessage(message);
}

export function showErrorMessage(message: string, error?: Error): void {
  if (error) {
    vscode.window.showErrorMessage(message + NEW_LINE + error.name + NEW_LINE + error.message);
  }
  else {
    vscode.window.showErrorMessage(message);
  }
}

export function getUri(webview: vscode.Webview, extensionUri: vscode.Uri, pathList: string[]) {
  return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, ...pathList));
}

export function getExtensionVersion() {
  try {
    const { version: extVersion } = JSON.parse(
      readFileSync(join(__dirname, '..', 'package.json'), { encoding: 'utf8' })
    );
    return extVersion;
  } catch (err) {
    return '0.0.0';
  }
}

export function openFile(file: string) {
  vscode.commands.executeCommand('vscode.open', vscode.Uri.file(file), vscode.ViewColumn.One);
}

function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}

export function getMilliSeconds(startDate: Date, endDate: Date): number {
  if (!startDate) {
    return 0;
  }

  if (!endDate || endDate < startDate) {
    endDate = new Date();//now
  }

  return endDate.valueOf() - startDate.valueOf();
}

export function getSeconds(startDate: Date, endDate: Date): number {
  return Math.floor(getMilliSeconds(startDate, endDate) / 1000);
}

export function getDuration(startDate: Date, endDate: Date): string {
  if (!startDate) {
    return "";
  }

  const duration = getMilliSeconds(startDate, endDate);
  return (convertMsToTime(duration));
}

export function convertMsToTime(milliseconds: number): string {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  let result: string;

  if (hours === 0) {
    result = `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
  }
  else {
    result = `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
  }

  return result;
}

export function isJsonString(jsonString: string): boolean {
  try {
    const json = JSON.parse(jsonString);
    return (typeof json === 'object');
  } catch (e) {
    return false;
  }
}

export function isValidDate(dateString: string): boolean {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) {
    return false;  // Invalid format
  }
  const d = new Date(dateString);
  const dNum = d.getTime();
  if (!dNum && dNum !== 0) {
    return false; // NaN value, Invalid date
  }
  return d.toISOString().slice(0, 10) === dateString;
}

export function SanitizeFileName(filename: string): string {
  // Replace invalid characters with underscores
  return filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').replace(/[\u{80}-\u{9F}]/gu, '_');
}

export function bytesToText(bytes: number | undefined): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === undefined) { return ''; }
  if (bytes === 0) { return '0 Bytes'; }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

export function CopyToClipboard(text: string): MethodResult<boolean> {
  const result = new MethodResult<boolean>();
  try {
    vscode.env.clipboard.writeText(text);
    result.isSuccessful = true;
  }
  catch (error: any) {
    result.isSuccessful = false;
    showErrorMessage('CopyToClipboard Error !!!', error);
  }
  return result;
}

export function CopyListToClipboard(textList: string[]): MethodResult<boolean> {
  let text: string = "";
  for (const t of textList) {
    if (t) {
      text += t;
      if (textList.length > 1) { text += "\n"; }
    }
  }

  return CopyToClipboard(text);
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function withProgress<T>(task: (progress: vscode.Progress<{ increment: number; message?: string }>) => Promise<T>): Promise<T> {
  return Promise.resolve(vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, cancellable: false }, task));
}

export function dispose(): void {
  if (outputChannel) {
    outputChannel.dispose();
  }
  if (logsOutputChannel) {
    logsOutputChannel.dispose();
  }
}