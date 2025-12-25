/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';
import * as api from '../common/API';
import * as ui from '../common/UI';
import { ParsedIniData } from "@aws-sdk/types";
import { Session } from '../common/Session';
import { AIHandler } from '../chat/AIHandler';

export class StatusBarItem implements vscode.Disposable {

    public static WorkingText: string = "$(plug) Aws $(sync~spin)";
    public static ExecutingAwsCommandText: string = "$(plug) Aws $(loading~spin)";
    public static Current: StatusBarItem;

    public statusBarItem: vscode.StatusBarItem;

    public Text: string = StatusBarItem.WorkingText;
    public ToolTip: string = "Loading ...";

    public IniData: ParsedIniData | undefined;
    public HasCredentials: boolean = false;


    constructor() {
        ui.logToOutput('StatusBarItem.constructor Started');
        StatusBarItem.Current = this;

        const statusBarClickedCommand = 'awsflow.statusBarClicked';

         if (Session.Current) {
            Session.Current.Context.subscriptions.push(vscode.commands.registerCommand(statusBarClickedCommand, StatusBarItem.StatusBarClicked));
         }

        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 3);
        this.statusBarItem.command = statusBarClickedCommand;
        this.statusBarItem.text = StatusBarItem.WorkingText;
        this.statusBarItem.tooltip = this.ToolTip;
        this.statusBarItem.show();

        this.StartWorking();

        this.GetCredentials();
    }

    public async GetCredentials() {
        ui.logToOutput('StatusBarItem.GetDefaultCredentials Started');

        let iniCredentials = await api.GetIniCredentials();
        if (iniCredentials) {
            this.HasCredentials = true;
            let profileData = await api.GetIniProfileData();
            try {
                ui.logToOutput('StatusBarItem.GetCredentials IniData Found');
                this.IniData = profileData;

                if (Session.Current && !this.Profiles.includes(Session.Current?.AwsProfile) && this.Profiles.length > 0) {
                    Session.Current!.AwsProfile = this.Profiles[0];
                    Session.Current!.SaveState();
                }

            }
            catch (error) {
                ui.logToOutput('StatusBarItem.GetCredentials Error ' + error);
            }
        }
        else {
            let credentials = await api.GetCredentials();
            if (credentials) {
                this.HasCredentials = true;
            }
        }

        this.RefreshText();

    }

    public get Profiles(): string[] {
        let result: string[] = [];
        if (this.IniData) {
            result = Object.keys(this.IniData);
        }
        return result;
    }

    public get HasIniCredentials(): boolean {
        return this.IniData !== undefined;
    }

    public get HasDefaultProfile(): boolean {
        return this.Profiles.includes("default");
    }

    public SetAwsProfile() {
        ui.logToOutput('StatusBarItem.SetAwsLoginCommand Started');
        if (this.Profiles && this.Profiles.length > 0) {
            let selected = vscode.window.showQuickPick(this.Profiles, { canPickMany: false, placeHolder: 'Select Profile' });
            selected.then(value => {
                if (value) {
                    Session.Current!.AwsProfile = value;
                    //this.ShowLoading();
                    Session.Current!.SaveState();
                    Session.Current!.ClearCredentials();
                }
            });
        }
        else {
            ui.showWarningMessage("No Profiles Found !!!");
        }
    }

    public ListAwsProfiles() {
        ui.logToOutput('StatusBarItem.ListAwsProfiles Started');
        if (this.Profiles && this.Profiles.length > 0) {
            ui.showOutputMessage(this.Profiles);
        }
        else {
            ui.showWarningMessage("No Profiles Found !!!");
        }
        ui.showOutputMessage("AwsLoginShellCommands: ", "", false);
    }

    public StartWorking() {
        ui.logToOutput('StatusBarItem.StartWorking Started');
        this.statusBarItem.text = StatusBarItem.WorkingText;
    }

    public EndWorking() {
        ui.logToOutput('StatusBarItem.EndWorking Started');
        this.RefreshText();
    }

    public StartAwsCommand() {
        ui.logToOutput('StatusBarItem.StartAwsCommand Started');
        this.statusBarItem.text = StatusBarItem.ExecutingAwsCommandText;
    }

    public EndAwsCommand() {
        ui.logToOutput('StatusBarItem.EndAwsCommand Started');
        this.RefreshText();
    }

    public RefreshText() {
        ui.logToOutput('StatusBarItem.RefreshText Started');
        
        this.ToolTip = "Awsflow: @aws How can I help you?";
        if (!Session.Current?.CurrentCredentials) {
            this.ToolTip += "\nNo Aws Credentials Found !!!";
            this.Text = "$(plug) Aws No Credentials";
        }
        else {
            this.ToolTip += "\nYou have Aws Credentials";
            this.Text = "$(plug) Aws $(check)";
        }

        this.ToolTip += "\nProfile: " + (Session.Current?.AwsProfile || "default");
        this.ToolTip += "\nRegion: " + (Session.Current?.AwsRegion || "us-east-1");
        this.ToolTip += "\nEndPoint: " + (Session.Current?.AwsEndPoint || "aws default");

        this.statusBarItem.tooltip = this.ToolTip;
        this.statusBarItem.text = this.Text;
    }

    public GetBoolChar(value: boolean) {
        if (value) {
            return "✓";
        }
        else {
            return "x";
        }

    }

    public static async StatusBarClicked() {
        ui.logToOutput('StatusBarItem.StatusBarClicked Started');
        // if (Session.Current?.IsHostSupportLanguageTools()) 
        // {
        //     AIHandler.Current.askAI();
        // }
        // else 
        // {
        //     StatusBarItem.OpenCommandPalette();
        // }
        StatusBarItem.OpenCommandPalette();
    }

    public static async RefreshButtonClicked() {
        ui.logToOutput('StatusBarItem.RefreshButtonClicked Started');

    }

    public static async ProfileButtonClicked() {
        ui.logToOutput('StatusBarItem.ProfileButtonClicked Started');

    }

    public static OpenCommandPalette() {
        const extensionPrefix = 'Awsflow:';
        vscode.commands.executeCommand('workbench.action.quickOpen', `> ${extensionPrefix}`);
    }

    public dispose() {
        this.statusBarItem.dispose();
    }
}