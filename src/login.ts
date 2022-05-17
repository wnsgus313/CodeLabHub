import * as vscode from 'vscode';
import urlJoin from 'url-join';

export function askUserForEmail() {
	return vscode.window.showInputBox({
		prompt: 'input your email',
        ignoreFocusOut: true
	});
}

export function askUserForPassword() {
	return vscode.window.showInputBox({
		prompt: 'input your password',
        ignoreFocusOut: true,
        password: true
	});
}

export async function askUserForSave(info: vscode.Memento, url: string) {
	let email = await askUserForEmail();
	let password = await askUserForPassword();

	info.update('email', email);
	info.update('password', password);

	saveToken(info, url);
}

export async function saveToken(info: vscode.Memento, url: string) {
	const axios = require('axios');

	const email = await info.get('email');
	const password = await info.get('password');
    
    url = urlJoin(url, 'api/v1/tokens/');

	await axios.get(url, {auth: {username:email, password:password}})
	.then((res:any) => {        
		info.update('token', res.data['token']);
        info.update('expiration', res.data['expiration']);
        
        changestatusTrue(info);
	})
	.catch((err:any) => {
		vscode.window.showErrorMessage(`Check your email or password!`);
	});
}

export async function logout(info: vscode.Memento) {

	info.update('email', undefined);
	info.update('password', undefined);
    info.update('expiration', undefined);
    
    changestatusFalse(info);
}

export async function changestatusTrue(info: vscode.Memento) {
    const token = await info.get('token');
    const expiration: number | any = await info.get('expiration');

	if (info.get('token') !== undefined)
	{
		await vscode.commands.executeCommand('setContext', 'extensionSelectionMode', true);

        // token 유효기간
        setTimeout(() => {
            logout(info);
        }, expiration * 1000);
	}
}

export function changestatusFalse(info: vscode.Memento) {
    info.update('token', undefined);
	vscode.commands.executeCommand('setContext', 'extensionSelectionMode', false);
}