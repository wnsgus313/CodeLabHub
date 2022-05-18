import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let axios = require('axios');

export async function makeLab(url: string, targetPath: string, info: vscode.Memento){
    const labName = await getLabName();
    const token = await info.get('token');
    const sendName = {
        'labName': labName
    };

    axios.post(url, sendName, {auth: {username:token}})
		.then((res:any) => {
            if(labName){
                if(!fs.existsSync(path.join(targetPath, labName))){
                    fs.mkdirSync(path.join(targetPath, labName));
                }
            }
			vscode.window.showInformationMessage(`Make Lab successfully.`);
			vscode.commands.executeCommand('extension.getLabs');
		}).catch((err:any) => {
			vscode.window.showErrorMessage(`Make Lab failed`);
    });
}

function getLabName()
{
    return vscode.window.showInputBox({
		prompt: 'Lab Name',
        ignoreFocusOut: true
	});
}

export async function deleteLab(url: string, info: vscode.Memento, labName: string) {
    const token = await info.get('token');
    const sendName = {
        'deleteLab': labName
    };

    vscode.window.showInformationMessage(`Do you want to delete ${labName} ?`, "Yes", "No")
        .then(answer => {
            if (answer === "Yes") {
				axios.post(url, sendName, {auth: {username:token}})
				.then((res:any) => {
					vscode.window.showInformationMessage(`Delete Lab successfully.`);
					vscode.commands.executeCommand('extension.getLabs');
				}).catch((err:any) => {
					vscode.window.showErrorMessage(`Delete Lab failed`);
				});
            }
			else {
                vscode.window.showInformationMessage("Exit");
			}
        });
}

export async function fetchInfo(url: string | undefined, targetPath: string, info: any) {
	const token = await info.get('token');

	axios.get(url, {auth: {username:token}})
	.then((res:any) => {
		console.log(JSON.stringify(res.data));
		fs.writeFileSync(targetPath, JSON.stringify(res.data));

	}).catch((err:any) => {
		vscode.window.showErrorMessage(`Fetch info failed!`);
	});
}