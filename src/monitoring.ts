import * as vscode from "vscode";
import { getLogWebviewContent } from "./view";
let axios = require('axios');

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

export function initializeLog(url:string, info:any) {
    const token = info.get('token');

    axios.delete(url, {auth: {username:token}})
    .then((res:any) => {
        vscode.window.showInformationMessage(`Delete log successfully.`);
    }).catch((err:any) => {
        vscode.window.showErrorMessage(`Delete log failed`);
    });
}

let endFlag = false;
let timer: any;

let editor: vscode.TextEditor | undefined;
let minuteOne: string = '0';
let oneMinute:number = 0;
let saveThing: number = 0;

export function sendLog(url: string, info: vscode.Memento) {
    editor = vscode.window.activeTextEditor;

    let curr = vscode.workspace;
    minuteOne = '0';
	oneMinute = 0;

    // detect one keyboard
    curr.onDidChangeTextDocument((e) => {
        if (e.contentChanges.length >= 1) {
            oneMinute++; 
            minuteOne = oneMinute.toString(); 
        }
        else {
            oneMinute += 0; 
            minuteOne = oneMinute.toString();
        }
    });
    endFlag = true;
    clearTimeout(timer);
    timer = setInterval(()=>startTraining(url, editor?.document.getText(), info), 10000);
    let saveOne = editor?.document.getText();
    oneMinute = 0;
}

export async function stopLog(url: string, info: vscode.Memento) {
    endFlag = false;

    clearInterval(timer);

    const token = info.get('token');

    let logs = {
        'flag': 1,
        'code': editor?.document.getText(),
        'length': 0
    };

    axios.post(url, logs, {auth: {username:token}})
    .then((res:any) => {
        vscode.window.showInformationMessage(`Sending log successfully stop.`);
    }).finally(() => {
        saveThing = 0;
    });

    saveThing = 0;
}

export async function startTraining(url: string, send: any, info: vscode.Memento) {

	if (endFlag === true)
	{
		const token = info.get('token');

		let one = Number(minuteOne);

        let logs = {
            'flag': 0,
            'code': send,
            'length': 0
        };

        if (one === 0) {
            logs = {
                'flag': 0,
                'code': send,
                'length': 0
            };
            oneMinute = 0;
            saveThing = 0;
            one = 0;
        }
        else if(saveThing >= one) {
            logs = {
                'flag': 0,
                'code': send,
                'length': one
            };
        }
        else if (one > saveThing) {
            logs = {
                'flag': 0,
                'code': send,
                'length': one - saveThing
            };
        }

		axios.post(url, logs, {auth: {username:token}})
		.then((res:any) => {
			// vscode.window.showInformationMessage(`${oneMinute}`);
		}).catch((err:any) => {
			vscode.window.showErrorMessage(`Please open your editor!`);
		}).finally(() => {
            minuteOne = '0';
            oneMinute = 0;
            one = 0;
        });
        saveThing = oneMinute;
        if (saveThing === 0) {
            oneMinute = 0;
            one = 0;
        }
	}		
}