import * as ui from './UI';
import * as vscode from 'vscode';
import { AwsCredentialIdentity } from '@aws-sdk/types';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import * as MessageHub from './MessageHub';

export class Session implements vscode.Disposable {
    public static Current: Session | undefined = undefined;

    public Context: vscode.ExtensionContext;
    public ExtensionUri: vscode.Uri;
    public AwsProfile: string = "default";
    public AwsEndPoint: string | undefined;
    public AwsRegion: string = "us-east-1";
    public CurrentCredentials: AwsCredentialIdentity | undefined;
    public DisabledTools: Set<string> = new Set<string>();
    public DisabledCommands: Map<string, Set<string>> = new Map<string, Set<string>>();
    public HostAppName: string = '';
    public AwsReadonlyMode: boolean = false;
    public IsProVersion: boolean = true;

    private _onDidChangeSession = new vscode.EventEmitter<void>();
    public readonly onDidChangeSession = this._onDidChangeSession.event;

    public constructor(context: vscode.ExtensionContext) {
        Session.Current = this;
        this.Context = context;
        this.ExtensionUri = context.extensionUri;
        this.LoadState();
        this.GetCredentials();
        this.HostAppName = vscode.env.appName;
    }

    public IsHostSupportLanguageTools(): boolean {
        const supportedHosts = ['Visual Studio Code', 'Visual Studio Code - Insiders', 'VSCodium'];
        return supportedHosts.includes(this.HostAppName);
    }

    public IsDebugMode(): boolean {
        return this.Context.extensionMode !== vscode.ExtensionMode.Production;
    }

    public SaveState() {
        ui.logToOutput('Saving state...');

        try {
            this.Context.globalState.update('AwsProfile', Session.Current?.AwsProfile);
            this.Context.globalState.update('AwsEndPoint', Session.Current?.AwsEndPoint);
            this.Context.globalState.update('AwsRegion', Session.Current?.AwsRegion);
            this.Context.globalState.update('AwsReadonlyMode', Session.Current?.AwsReadonlyMode);
            // Save disabled tools and commands
            this.Context.globalState.update('DisabledTools', Array.from(Session.Current?.DisabledTools || []));
            const disabledCommandsObj: Record<string, string[]> = {};
            Session.Current?.DisabledCommands.forEach((commands, tool) => {
                disabledCommandsObj[tool] = Array.from(commands);
            });
            this.Context.globalState.update('DisabledCommands', disabledCommandsObj);
            
            this._onDidChangeSession.fire();
        } catch (error: any) {
            ui.logToOutput("Session.SaveState Error !!!", error);
        }
    }

    public LoadState() {
        ui.logToOutput('Loading state...');

        try {
            const AwsProfileTemp: string | undefined = this.Context.globalState.get('AwsProfile');
            const AwsEndPointTemp: string | undefined = this.Context.globalState.get('AwsEndPoint');
            const AwsRegionTemp: string | undefined = this.Context.globalState.get('AwsRegion');
            const AwsReadonlyModeTemp: boolean | undefined = this.Context.globalState.get('AwsReadonlyMode');
            if (AwsEndPointTemp) { Session.Current!.AwsEndPoint = AwsEndPointTemp; }
            if (AwsRegionTemp) { Session.Current!.AwsRegion = AwsRegionTemp; }
            if (AwsProfileTemp) { Session.Current!.AwsProfile = AwsProfileTemp; }
            if (AwsReadonlyModeTemp !== undefined) { Session.Current!.AwsReadonlyMode = AwsReadonlyModeTemp; }

            // Load disabled tools and commands
            const disabledToolsArray: string[] | undefined = this.Context.globalState.get('DisabledTools');
            if (disabledToolsArray) {
                Session.Current!.DisabledTools = new Set(disabledToolsArray);
            }
            
            const disabledCommandsObj: Record<string, string[]> | undefined = this.Context.globalState.get('DisabledCommands');
            if (disabledCommandsObj) {
                Session.Current!.DisabledCommands = new Map();
                Object.entries(disabledCommandsObj).forEach(([tool, commands]) => {
                    Session.Current!.DisabledCommands.set(tool, new Set(commands));
                });
            }

        } catch (error: any) {
            ui.logToOutput("Session.LoadState Error !!!", error);
        }
    }

    public async SetAwsEndpoint() {
        const current = Session.Current?.AwsEndPoint || '';
        const value = await vscode.window.showInputBox({
            prompt: 'Enter AWS Endpoint URL (e.g., https://s3.amazonaws.com or custom S3-compatible endpoint)',
            placeHolder: 'https://example-endpoint',
            value: current,
        });
        if (value !== undefined) {
            if (!Session.Current) {
                ui.showErrorMessage('Session not initialized', new Error('No session'));
                return;
            }
            Session.Current.AwsEndPoint = value.trim() || undefined;
            Session.Current.SaveState();
            ui.showInfoMessage('AWS Endpoint updated');
            ui.logToOutput('AWS Endpoint set to ' + (Session.Current.AwsEndPoint || 'undefined'));
            Session.Current.ClearCredentials();
        }
    }

    public async SetAwsRegion() {
        const current = Session.Current?.AwsRegion || 'us-east-1';
        const value = await vscode.window.showInputBox({
            prompt: 'Enter default AWS region',
            placeHolder: 'us-east-1',
            value: current,
        });
        if (value !== undefined) {
            if (!Session.Current) {
                ui.showErrorMessage('Session not initialized', new Error('No session'));
                return;
            }
            Session.Current.AwsRegion = value.trim() || 'us-east-1';
            Session.Current.SaveState();
            Session.Current.ClearCredentials();
            ui.showInfoMessage('Default AWS Region updated');
            ui.logToOutput('AWS Region set to ' + (Session.Current.AwsRegion || 'us-east-1'));
        }
    }

    public async SetAwsReadonlyMode() {
        if (!Session.Current) {
            ui.showErrorMessage('Session not initialized', new Error('No session'));
            return;
        }
        
        const currentState = Session.Current.AwsReadonlyMode ? 'Enable' : 'Disable';
        const options = ['Enable', 'Disable'];
        
        const selected = await vscode.window.showQuickPick(options, {
            placeHolder: `Current: ${currentState === 'Enable' ? 'Enabled' : 'Disabled'}`,
            canPickMany: false,
        });
        
        if (selected !== undefined) {
            Session.Current.AwsReadonlyMode = selected === 'Enable';
            Session.Current.SaveState();
            MessageHub.StatusbarTooltipChanged();
            if (Session.Current.AwsReadonlyMode) {
                ui.showInfoMessage('AWS Readonly Mode enabled. All write operations will be blocked.');
            } else {
                ui.showInfoMessage('AWS Readonly Mode disabled. Write operations are allowed.');
            }
            ui.logToOutput(`AWS Readonly Mode set to ${selected}`);
        }
    }

    public async GetCredentials(renew: boolean = false): Promise<AwsCredentialIdentity | undefined> {
        if (this.CurrentCredentials !== undefined && !renew) {
            if(this.CurrentCredentials.expiration && (new Date() >= this.CurrentCredentials.expiration)) {
                ui.logToOutput('Cached credentials expired, refreshing...');
            } else {
                ui.logToOutput(`Using cached credentials (AccessKeyId=${this.CurrentCredentials.accessKeyId})`);
                return this.CurrentCredentials;
            }
        }

        try {
            process.env.AWS_PROFILE = this.AwsProfile;

            const provider = fromNodeProviderChain({ ignoreCache: true });
            this.CurrentCredentials = await provider();

            if (!this.CurrentCredentials) {
                MessageHub.StatusbarTooltipChanged();
                throw new Error('AWS credentials not found');
            }

            ui.logToOutput(`Credentials loaded (AccessKeyId=${this.CurrentCredentials.accessKeyId})`);
            MessageHub.StatusbarTooltipChanged();
            return this.CurrentCredentials;
        } catch (error: any) {
            ui.logToOutput('Failed to get credentials', error);
            throw error;
        }
    }

    public RefreshCredentials() {
        this.GetCredentials(true);
        this._onDidChangeSession.fire();
        // MessageHub.CredentialsChanged();
        ui.logToOutput('Credentials cache refreshed');
    }

    public ClearCredentials() {
        this.CurrentCredentials = undefined;
        MessageHub.StatusbarTooltipChanged();
        this._onDidChangeSession.fire();
        ui.logToOutput('Credentials cache cleared');
    }

    public dispose() {
        Session.Current = undefined;
        this._onDidChangeSession.dispose();
    }
}