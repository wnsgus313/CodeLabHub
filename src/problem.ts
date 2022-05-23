import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from "path";
import got from 'got';
import urlJoin from 'url-join';

import FormData = require('form-data');
let axios = require('axios');


export function getProblemName()
{
    return vscode.window.showInputBox({
		prompt: 'Problem Name',
        ignoreFocusOut: true
	});
}

export async function uploadProblem(url:string, targetPath:string, info:vscode.Memento, problemName:string) {
	const token = await info.get('token');

	let fileLists:string[];
	try{
		fileLists = fs.readdirSync(targetPath);
	} catch(e) {
		vscode.window.showErrorMessage(`Check ${problemName} in your workspace!`);
		return;
	};

	let filedata:string[] = [];
	let filename:string[] = [];
	fileLists.forEach((file) => {
		let reg = /(.*?)\.(pdf)$/;
        if (!file.match(reg)){
            filedata.push(fs.readFileSync(path.join(targetPath, file), "utf-8"));
			filename.push(file);
        }
	});

	let files = {
		'filename': filename,
		'file': filedata
	};
	axios.post(url, {files}, {auth: {username:token}})
	.then(async (res:any) => {
		await uploadPdf(url, targetPath, info, problemName);
	}).catch((err:any) => {
		vscode.window.showErrorMessage(`${problemName} upload failed`);
	});
}

async function uploadPdf(url:string, targetPath:string, info:vscode.Memento, problemName: string)
{
	const formData = new FormData();
    const token = await info.get('token');
	console.log(urlJoin(url, 'pdf'));
    let fileLists:string[] = fs.readdirSync(targetPath);

    fileLists.forEach((file) => {
        let reg = /(.*?)\.(pdf|PDF)$/;
        if (file.match(reg)){
            formData.append('file', fs.createReadStream(path.join(targetPath, file)), file);
        }
	});

    const auth = 'Basic ' + Buffer.from(token + ':').toString('base64');

    try {
        let res = await got.post(urlJoin(url, 'pdf'), {
            body: formData,
            headers: {
                "Authorization": auth
            }
        });
        vscode.window.showInformationMessage(`${problemName} upload successfully`);
    } catch (e) {
        vscode.window.showErrorMessage(`${problemName} upload failed`);
    }
}

export async function deleteProblem(url:string, title:string, info:vscode.Memento) {
	const token = await info.get('token');

	vscode.window.showInformationMessage(`Do you want to delete ${title} ?`, "Yes", "No")
	.then(answer => {
		if (answer === "Yes") {
			axios.delete(url, {auth: {username:token}})
			.then((res:any) => {
				vscode.window.showInformationMessage(`${title} delete successfully.`);
			}).catch((err:any) => {
				vscode.window.showErrorMessage(`Fail delete problem ${title}`);
			});
		}
		else {
			vscode.window.showInformationMessage("Exit");
		}
	});
}

export async function fetchProblem(url:string, title:string, targetPath:string, info:vscode.Memento) {
	const token = await info.get('token');

	const auth = 'Basic ' + Buffer.from(token + ':').toString('base64');

	if (fs.existsSync(targetPath)){
		return;
	}

	axios.get(url, {auth: {username:token}})
	.then((res:any) => {
		if(!fs.existsSync(targetPath)){
			fs.mkdirSync(targetPath);
		}
		
		res.data['file_list'].forEach((filename:string) => {
			const saveFilePath = path.join(targetPath, filename);
			let reg = /(.*?)\.(pdf)$/;
			if (!filename.match(reg)){
				axios.get(urlJoin(url, filename), {auth: {username:token}})
				.then((res:any) => {
					fs.writeFileSync(saveFilePath, res.data);
				})
				.catch((err:any) => {
					vscode.window.showErrorMessage(`Fail save ${filename} in Problem ${title}`);
				});
			}
			else {
				downloadImage(urlJoin(url, filename + '.pdf'), saveFilePath, auth);
			}
		});

	}).catch((err:any) => {
		vscode.window.showErrorMessage(`Please check Problem Id : ${title}`);
	});
}


export async function downloadImage(url: any, filePath:any, token: any) {
	const saveFilePath = path.resolve(filePath);
	const writer = fs.createWriteStream(saveFilePath);

	const response = await axios({
		url,
		method: 'GET',
		responseType: 'stream',
		headers: {
			"Authorization": token
		}
	});

	response.data.pipe(writer);

	return new Promise((resolve, reject) => {
		writer.on('finish', resolve);
		writer.on('error', reject);
	});
}
