import * as vscode from "vscode";
import { getChatWebviewContent } from "./view";

export function openPanel(url:string, info:any) {
    const token = info.get('token');

    const panel = vscode.window.createWebviewPanel(
        "Codelab Chat",
        "#Chat",
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
            enableCommandUris: true,
            enableFindWidget: true,
        }
    );
    panel.webview.html = getChatWebviewContent(token, url);
    // panel.iconPath = vscode.Uri.joinPath(
    //     this._extensionUri,
    //     'img',
    //     'white-small.png'
    // );
}

export class VsChatProvider implements vscode.WebviewViewProvider {
    info: any;
    constructor(private readonly _extensionUri: vscode.Uri, info:any) {this.info = info;}

    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        
        webviewView.webview.onDidReceiveMessage((data) => {
            switch (data.type) {
                case "success": {
                    this.openPanel(data, this.info);
                    break;
                }
                case "error": {
                    vscode.window.showErrorMessage(data.value);
                    break;
                }
            }
        });
    }
    
    openPanel(data: any, info:any) {
        let username = data.username;
        let token = info.get('token');
        let url = info.get('url');
        const panel = vscode.window.createWebviewPanel(
            "Codelab Chat",
            "#Chat",
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                enableCommandUris: true,
                enableFindWidget: true,
            }
        );
        panel.webview.html = getChatWebviewContent(token, url);
        // panel.iconPath = vscode.Uri.joinPath(
        //     this._extensionUri,
        //     'img',
        //     'white-small.png'
        // );
    }

    getNonce() {
        let text = "";
        const possible ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 32; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }



    private _getHtmlForWebview(webview: vscode.Webview): string {

        const nonce = this.getNonce();

        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "static", "main.js")
        );

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				
				<title>vsChat</title>
			</head>
        <body>
        <div class="mylogo"></div>
        <h2>Welcome to CodelabHib Chat</h2>
        
        <br>
				<label for="fname">Username:</label>
        <input type="text" id="username" name="username" placeholder="Your username">
        
        
        <br>
        
        <button id="enterBtn" class="bluebtn">Enter Chatroom 💬</button>
        <script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;

    }

}