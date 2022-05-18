import * as vscode from "vscode";
import { getLogWebviewContent } from "./view";

// Create and show panel
export function monitoringOpenPanel(url:string, info:any) {
    const panel = vscode.window.createWebviewPanel(
        'monitoring',
		'Monitoring',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
            enableCommandUris: true,
            enableFindWidget: true,
        }
    );

    const token = info.get('token');

    // And set its HTML content
    panel.webview.html = getLogWebviewContent(url, token);    
}