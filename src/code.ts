import * as vscode from 'vscode';
import * as fs from 'fs';
import urlJoin from 'url-join';
import * as path from 'path';

let axios = require('axios');

export async function saveAllStudentCode(url: string, title: string, targetPath: string, info: vscode.Memento){
    let studentsId: string[] = [];
	let studentsEmail: string[] = [];
    const token = await info.get('token');

    axios.get(url, {auth: {username:token}})
	.then((res:any) => {
		if(!fs.existsSync(targetPath)){
			fs.mkdirSync(targetPath);
		}
		res.data['dir_list'].forEach(async (dirname:string) => {
			studentsId.push(dirname);
		});

		res.data['email_list'].forEach(async (email:string) => {
			studentsEmail.push(email);
		});
	})
	.then(() => {
		for (const student of studentsId) {
			axios.get(urlJoin(url, student), {auth: {username:token}})
			.then((res:any) => {
				for(const email of studentsEmail) {
					if(!fs.existsSync(path.join(targetPath, email))){
						fs.mkdirSync(path.join(targetPath, email));
					}
					res.data['file_list'].forEach((filename:string) => {
						const saveFilePath = path.join(targetPath, email, filename);
						axios.get(urlJoin(url, student, filename), {auth: {username:token}})
						.then((res:any) => {
							fs.writeFileSync(saveFilePath, res.data);
						})
						.catch((err:any) => {
							vscode.window.showErrorMessage(`Fail save ${filename} in Problem ${title}/${email}`);
						});
					});
                    vscode.window.showInformationMessage(`${title} Student code save successfully.`);
				}
			}).catch((err:any) => {
				vscode.window.showErrorMessage(`Fail save student codes ${title}`);
			});
		}
	})
	.catch((err:any) => {
		vscode.window.showErrorMessage(`Fail save student codes ${title}`);
	});
}