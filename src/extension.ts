import * as vscode from 'vscode';
import urlJoin from 'url-join';
import * as path from 'path';

import { LabProvider } from './treeView';
import { login, logout } from './login';
import { chatOpenPanel } from './chat';
import { monitoringOpenPanel, initializeLog, sendLog, stopLog } from './monitoring';
import { uploadProblem, deleteProblem, getProblemName, fetchProblem } from './problem';
import { makeLab, deleteLab, fetchInfo } from './lab';
import { saveAllStudentCode, submitCode } from './code';
import { inviteMember, inviteTA, deleteMember } from './member';
import { downloadVideo, uploadVideo, uploadVideoTA, deleteVideo } from './video';
import { getFirstWebview } from './view';

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
	const infoUrl = 'api/v1/info';
	const deleteMemberUrl = 'api/v1/deleteStudentFromLab';
	const logUrl = 'api/v1/logs';
	const videoUrl = 'api/v1/video/';

	// chronicle 변수
	const editJsonFile = require("edit-json-file");
	const home = process.env.HOME || process.env.USERPROFILE;
	const settingFileName = editJsonFile(`${home}/Library/Application\ Support/Code/User/settings.json`);
	
	const labProvider = new LabProvider(rootPath, info);
	vscode.window.registerTreeDataProvider('labView', labProvider); // treeData 등록

	// treeView refresh, labs.json 가져오기
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.refreshLab', async () => {
		console.log('command : refreshLab');
		labProvider.refresh();
		labProvider.refresh();
		if(rootPath){
			await fetchInfo(urlJoin(rootUrl, infoUrl), path.join(rootPath, 'labs.json'), info);
		}
		labProvider.refresh();
		labProvider.refresh();
	}));


	// login
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.login', async () => {
		console.log('command : login');
		await login(info, rootUrl);
		vscode.commands.executeCommand('codelabhub.refreshLab');
	}));

	// logout
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.logout', () => {
		console.log('command : logout');
		logout(info);
	}));



	// admin이 문제 업로드
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.uploadProblem', async (item) => {
		console.log('command : uploadProblem');
		const problemName = await getProblemName();
		if(rootPath && problemName){
			await uploadProblem(urlJoin(rootUrl, problemsUrl, item.labName, problemName), path.join(rootPath, item.labName, problemName), info, problemName);
		}
		vscode.commands.executeCommand('codelabhub.refreshLab');
	}));

	// admin이 문제 삭제
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.deleteProblem', async (item) => {
		console.log('command : deleteProblem');
		if(rootPath){
			await deleteProblem(urlJoin(rootUrl, problemsUrl, item.labName, item.label), item.label, info);
		}
		vscode.commands.executeCommand('codelabhub.refreshLab');
	}));

	// admin, student 문제, 코드들 가져오기
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.fetchProblem', async (item) => {
		console.log('command : fetchProblem');
		if(rootPath){
			await fetchProblem(urlJoin(rootUrl, item.labName, item.label), item.label, path.join(rootPath, item.labName, item.label), info);
		}
		vscode.commands.executeCommand('codelabhub.refreshLab');
	}));

	// 학생 코드 다 가져오기
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.saveStudentCode', async (item) => {
		console.log('command : saveStudentCode');
		if(rootPath){
			await saveAllStudentCode(urlJoin(rootUrl, codesUrl, item.labName, item.label), item.label, path.join(rootPath, item.labName, item.label + '_code'), info);
		}
	}));

	// admin이 Lab 만들기
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.makeLab', async () => {
		console.log('command : makeLab');
		if(rootPath){
			await makeLab(urlJoin(rootUrl, labUrl), rootPath, info);
		}
		vscode.commands.executeCommand('codelabhub.refreshLab');
	}));

	// admin이 lab 삭제
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.deleteLab', async (item) => {
		console.log('command : deleteLab');
		await deleteLab(urlJoin(rootUrl, labUrl, 'delete'), info, item.label);
		vscode.commands.executeCommand('codelabhub.refreshLab');
	}));

	// admin이 멤버 초대
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.inviteMember', async (item) => {
		console.log('command : inviteMember');
		
		await inviteMember(urlJoin(rootUrl, inviteUrl), item.labName, info);
		vscode.commands.executeCommand('codelabhub.refreshLab');
	}));

	// admin이 멤버 삭제
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.deleteMember', async (item) => {
		console.log('command : deleteMember');

		await deleteMember(urlJoin(rootUrl, deleteMemberUrl), item.labName, item.label, info);
		vscode.commands.executeCommand('codelabhub.refreshLab');
	}));

	// admin이 TA초대
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.inviteTA', async (item) => {
		console.log('command : inviteTA');

		await inviteTA(urlJoin(rootUrl, inviteTAUrl), item.labName, info);
		vscode.commands.executeCommand('codelabhub.refreshLab');
	}));

	// admin 모니터링
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.monitoringLog', (item) => {
		console.log('command : monitoringLog');
		monitoringOpenPanel(urlJoin(rootUrl, item.labName, 'practice'), info);
		vscode.commands.executeCommand('codelabhub.refreshLab');
	}));
	// admin 모니터링 초기화
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.initializeLog', (item) => {
		console.log('command : initializeLog');
		initializeLog(urlJoin(rootUrl, logUrl, item.labName), info);
		vscode.commands.executeCommand('codelabhub.refreshLab');
	}));

	

	// admin, student가 Code 제출 && 채점
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.submitCode', async (item) => {
		console.log('command : submitCode');
		if(rootPath){
			await submitCode(urlJoin(rootUrl, codesUrl, item.labName, item.label), item.label, path.join(rootPath, item.labName, item.label), info);
		}
		vscode.commands.executeCommand('codelabhub.refreshLab');
	}));
	
	// admin, student 전체 채팅
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.labChat', (item) => {
		console.log('command : labChat');
		chatOpenPanel(urlJoin(rootUrl, item.labName, 'chat'), info);
	}));

	// student 모니터링 log 시작
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.sendLog', (item) => {
		console.log('command : sendLog');

		sendLog(urlJoin(rootUrl, logUrl, item.labName), info);
	}));

	// student 모니터링 log 중지
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.stopLog', (item) => {
		console.log('command : stopLog');

		stopLog(urlJoin(rootUrl, logUrl, item.labName), info);
	}));


	// 비디오 녹화 시작
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.videoRecord', async (item) => {
		console.log('command : videoRecord');

		if(rootPath){
			settingFileName.set("chronicler.dest-folder", path.join(rootPath, item.labName));
			settingFileName.save();

			await vscode.commands.executeCommand('chronicler.recordWithAudio');
		}
	}));
	// 비디오 녹화 종료
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.videoRecordStop', () => {
		console.log('command : videoRecordStop');

		if(rootPath){
			vscode.commands.executeCommand('chronicler.stop');
		}
	}));


	// video 학생 업로드
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.videoUploadStudent', (item) => {
		console.log('command : videoUploadStudent');
		if(rootPath){
			uploadVideo(urlJoin(rootUrl, videoUrl, item.labName), path.join(rootPath, item.labName), info);
		}
		vscode.commands.executeCommand('codelabhub.refreshLab');
	}));

	// video TA 업로드
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.videoUploadTA', (item) => {
		console.log('command : videoUploadTA');
		if(rootPath){
			uploadVideoTA(urlJoin(rootUrl, videoUrl, item.labName, item.label), path.join(rootPath, item.labName), info);
		}
		vscode.commands.executeCommand('codelabhub.refreshLab');
	}));

	// admin 비디오 다운로드
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.downloadVideo', (item) => {
		console.log('command : downloadVideo');
		if(rootPath){
			downloadVideo(urlJoin(rootUrl, videoUrl, item.labName, item.label), path.join(rootPath, item.labName), info, item.labName, item.label);
		}
	}));

	// admin, student 비디오 삭제
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.videoDelete', (item) => {
		console.log('command : videoDelete');

		if(rootPath){
			deleteVideo(urlJoin(rootUrl, videoUrl, item.labName, item.label), path.join(rootPath, item.labName, item.label), info);
		}
		vscode.commands.executeCommand('codelabhub.refreshLab');
	}));


	// 메인화면
	context.subscriptions.push(vscode.commands.registerCommand('codelabhub.firstView', async () => {
		// Create and show panel
		const panel = vscode.window.createWebviewPanel(
		'firstView',
		'Welcome CodeLabHub',
		vscode.ViewColumn.One,
		{
			enableScripts: true,
			retainContextWhenHidden: true,
			enableCommandUris: true,
			enableFindWidget: true,
		}
		);

		const axios = require('axios');

		let token = await info.get('token');

		let url = 'http://203.245.41.143:8110/firstView';

		await axios.get(url, {auth: {username:token}})
		.then((res:any) => {
			panel.webview.html = getFirstWebview(res.data['users'], res.data['curr']);
		}).catch((err:any) => {
			vscode.window.showErrorMessage(`Start Error`);
		});

	}));
	

}

export function deactivate() {}
