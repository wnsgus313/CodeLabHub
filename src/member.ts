import * as vscode from 'vscode';

let axios = require('axios');

export async function inviteMember(url: string, labName: string, info: vscode.Memento){
    let email = await getEmail('Input student email to register');
    let token = info.get('token');

    let sendInfo = {
        'email': email,
        'lab': labName
    };

    axios.post(url, sendInfo, {auth: {username:token}})
    .then((res:any) => {
        vscode.window.showInformationMessage(`Success to invite ${email} to ${labName}`);
    }).catch((err:any) => {
        vscode.window.showErrorMessage(`Fail to invite ${email} to ${labName}`);
    });

}

export async function inviteTA(url: string, labName: string, info: vscode.Memento) {
    let email = await getEmail('Input TA email to register');
    let token = info.get('token');

    let sendInfo = {
        'email': email,
        'lab': labName
    };

    axios.post(url, sendInfo, {auth: {username:token}})
    .then((res:any) => {
        vscode.window.showInformationMessage(`Success to invite ${email} to ${labName}'s TA and invite to ${labName}`);
    }).catch((err:any) => {
        vscode.window.showErrorMessage(`Fail to invite ${email} to ${labName}'s TA`);
    });
}

function getEmail(prompt: string) {
	return vscode.window.showInputBox({
		prompt: prompt,
        ignoreFocusOut: true
	});
}
