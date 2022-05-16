import * as vscode from 'vscode';
import { LabProvider, Dependency } from './treeView';

export function activate(context: vscode.ExtensionContext) {
	const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined; // 워크 스페이스 경로
	const info = context.globalState;
	const url = vscode.workspace.getConfiguration().get('codelabhub.root-url'); // root url

	const labProvider = new LabProvider(rootPath, info);
	vscode.window.registerTreeDataProvider('labView', labProvider); // treeData 등록
	
	// treeView refresh, labs.json 가져오기
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.refreshLab', () => {
		console.log('command : refreshLab');
		labProvider.refresh();
	}));

	// admin이 문제 업로드
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.uploadProblem', () => {
		console.log('command : uploadProblem');
		labProvider.refresh();
	}));

	// admin이 문제 삭제
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.deleteProblem', () => {
		console.log('command : deleteProblem');
		labProvider.refresh();
	}));

	// admin, student 문제, 코드들 가져오기
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.fetchProblem', () => {
		console.log('command : fetchProblem');
		labProvider.refresh();
	}));

	// admin이 Lab 업로드
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.makeLab', () => {
		console.log('command : makeLab');
		labProvider.refresh();
	}));

	// admin이 lab 삭제
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.deleteLab', () => {
		console.log('command : deleteLab');
		labProvider.refresh();
	}));

	// admin이 멤버 초대
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.inviteMember', () => {
		console.log('command : inviteMember');
		labProvider.refresh();
	}));

	// admin이 멤버 삭제
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.deleteMember', () => {
		console.log('command : deleteMember');
		labProvider.refresh();
	}));

	// admin이 TA초대
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.inviteTA', () => {
		console.log('command : inviteTA');
		labProvider.refresh();
	}));

	// admin 모니터링
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.monitoringLog', () => {
		console.log('command : monitoringLog');
		labProvider.refresh();
	}));
	// admin 모니터링 초기화
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.initializeLog', () => {
		console.log('command : initializeLog');
		labProvider.refresh();
	}));

	

	// admin, student가 Code 제출 && 채점
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.submitCode', () => {
		console.log('command : submitCode');
		labProvider.refresh();
	}));
	
	// admin, student 채팅
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.labChat', () => {
		console.log('command : labChat');
		labProvider.refresh();
	}));

	// student 모니터링 log 시작
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.sendLog', () => {
		console.log('command : sendLog');
		labProvider.refresh();
	}));

	// student 모니터링 log 중지
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.stopLog', () => {
		console.log('command : stopLog');
		labProvider.refresh();
	}));

}

export function deactivate() {}
