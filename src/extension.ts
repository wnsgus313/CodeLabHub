import * as vscode from 'vscode';
import { LabProvider, Dependency } from './lab';

export function activate(context: vscode.ExtensionContext) {
	const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined; // 워크 스페이스 경로
	const info = context.globalState;

	const labProvider = new LabProvider(rootPath, info);

	vscode.window.registerTreeDataProvider('labView', labProvider);
	
	let disposable = vscode.commands.registerCommand('codelabhub.refreshLab', () => {
		console.log('refresh');
		labProvider.refresh();
	});
	context.subscriptions.push(disposable);
}

export function deactivate() {}
