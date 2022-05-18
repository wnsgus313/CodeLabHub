import * as vscode from 'vscode';
import urlJoin from 'url-join';
import * as path from 'path';

import { LabProvider } from './treeView';
import { login, logout } from './login';
import { chatOpenPanel } from './chat';
import { monitoringOpenPanel } from './monitoring';
import { fetchProblemList, uploadProblem, deleteProblem, getProblemName } from './problem';
import { makeLab, deleteLab } from './lab';
import { saveAllStudentCode } from './code';
import { inviteMember, inviteTA } from './member';

export function activate(context: vscode.ExtensionContext) {
	const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined; // 워크 스페이스 경로
	const info: vscode.Memento = context.globalState;
	const rootUrl: string | any = vscode.workspace.getConfiguration().get('codelabhub.root-url'); // root url

	const labUrl = 'api/v1/labs';
	const problemsUrl = 'api/v1/problems/';
	const codesUrl = 'api/v1/student_codes/';
	const inviteUrl = 'api/v1/invite';
	const inviteTAUrl = 'api/v1/inviteTA';
	const contentUrl = 'problems/';
	const problemListUrl = 'api/v1/problems/list';
	const videoUrl = 'api/v1/video/';
	
	const labProvider = new LabProvider(rootPath, info);
	vscode.window.registerTreeDataProvider('labView', labProvider); // treeData 등록
	
	// treeView refresh, labs.json 가져오기
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.refreshLab', async (item) => {
		console.log('command : refreshLab');
		if(rootPath){
			await fetchProblemList(urlJoin(rootUrl, 'api/v1/problems/list'), path.join(rootPath, item.labName, 'labs.json'), info);
		}

		labProvider.refresh();
	}));


	// login
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.login', () => {
		console.log('command : login');
		login(info, rootUrl);

		labProvider.refresh();
	}));

	// logout
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.logout', () => {
		console.log('command : logout');
		logout(info);

		labProvider.refresh();
	}));



	// admin이 문제 업로드
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.uploadProblem', async(item) => {
		console.log('command : uploadProblem');
		const problemName = await getProblemName();
		if(rootPath && problemName){
			uploadProblem(urlJoin(rootUrl, problemsUrl, item.labName, problemName), path.join(rootPath, item.labName, problemName), info, problemName);
		}
		labProvider.refresh();
	}));

	// admin이 문제 삭제
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.deleteProblem', (item) => {
		console.log('command : deleteProblem');
		if(rootPath){
			deleteProblem(urlJoin(rootUrl, problemsUrl, item.labName, item.label), item.label, info);
		}
		labProvider.refresh();
	}));

	// admin, student 문제, 코드들 가져오기
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.fetchProblem', () => {
		console.log('command : fetchProblem');
		labProvider.refresh();
	}));

	// 학생 코드 다 가져오기
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.saveStudentCode', (item) => {
		console.log('command : saveStudentCode');
		if(rootPath){
			saveAllStudentCode(urlJoin(rootUrl, codesUrl, item.labName, item.label), item.label, path.join(rootPath, item.labName, item.label + '_code'), info);
		}
		labProvider.refresh();
	}));

	// admin이 Lab 만들기
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.makeLab', () => {
		console.log('command : makeLab');
		if(rootPath){
			makeLab(urlJoin(rootUrl, labUrl), rootPath, info);
		}
		labProvider.refresh();
	}));

	// admin이 lab 삭제
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.deleteLab', (item) => {
		console.log('command : deleteLab');
		deleteLab(urlJoin(rootUrl, labUrl, 'delete'), info, item.label);
		labProvider.refresh();
	}));

	// admin이 멤버 초대
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.inviteMember', (item) => {
		console.log('command : inviteMember');
		
		inviteMember(urlJoin(rootUrl, inviteUrl), item.labName, info);
		labProvider.refresh();
	}));

	// admin이 멤버 삭제
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.deleteMember', () => {
		console.log('command : deleteMember');
		labProvider.refresh();
	}));

	// admin이 TA초대
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.inviteTA', (item) => {
		console.log('command : inviteTA');

		inviteTA(urlJoin(rootUrl, inviteTAUrl), item.labName, info);
		labProvider.refresh();
	}));

	// admin 모니터링
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.monitoringLog', (item) => {
		console.log('command : monitoringLog');
		monitoringOpenPanel(urlJoin(rootUrl, item.labName, 'practice'), info);
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
	
	// admin, student 전체 채팅
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.labChat', (item) => {
		console.log('command : labChat');
		chatOpenPanel(urlJoin(rootUrl, item.labName, 'chat'), info);

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
