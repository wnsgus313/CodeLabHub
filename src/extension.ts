import * as vscode from 'vscode';
import { LabProvider, Dependency } from './lab';

export function activate(context: vscode.ExtensionContext) {
	const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined; // 워크 스페이스 경로
	const info = context.globalState;

	const labProvider = new LabProvider(rootPath, info);
	vscode.window.registerTreeDataProvider('labView', labProvider); // treeData 등록
	
	// treeView refresh
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.refreshLab', () => {
		console.log('command : refreshLab');
		labProvider.refresh();
	}));

	// 교수가 문제 업로드
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.uploadProblem', () => {
		console.log('command : uploadProblem');
		labProvider.refresh();
	}));

	// 교수가 문제 삭제
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.deleteProblem', () => {
		console.log('command : deleteProblem');
		labProvider.refresh();
	}));

	// 교수가 Lab 업로드
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.makeLab', () => {
		console.log('command : makeLab');
		labProvider.refresh();
	}));

	// 교수가 lab 삭제
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.deleteLab', () => {
		console.log('command : deleteLab');
		labProvider.refresh();
	}));

}

export function deactivate() {}
