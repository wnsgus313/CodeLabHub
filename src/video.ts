import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import got from 'got';
import { downloadImage } from './problem';
import FormData = require('form-data');
import urlJoin from 'url-join';

const axios = require('axios');

const reg = /(.*?)\.(mp4|avi)$/;

function getVideoName()
{
    return vscode.window.showInputBox({
		prompt: 'Video file',
        ignoreFocusOut: true
	});
}

export async function uploadVideo(url: string, targetPath: string, info: vscode.Memento) {
    const formData = new FormData();
    const token = await info.get('token');

    const videoName = await getVideoName();

    if (videoName?.match(reg)) {
        formData.append('file', fs.createReadStream(path.join(targetPath, videoName)), videoName);
    }else {
        vscode.window.showErrorMessage(`Video file extension must be 'mp4' or 'avi'`);
    }

    const auth = 'Basic ' + Buffer.from(token + ':').toString('base64');

    try {
        let res = await got.post(url, {
            body: formData,
            headers: {
                "Authorization": auth
            }
        });

        vscode.window.showInformationMessage('Success upload video');
    } catch (e) {
        vscode.window.showErrorMessage(`Video upload failed`);
    }
}

export async function uploadVideoTA(url: string, targetPath: string, info: vscode.Memento) {
    const formData = new FormData();
    const token = await info.get('token');

    const videoName = await getVideoName();

    if (videoName?.match(reg)) {
        formData.append('file', fs.createReadStream(path.join(targetPath, videoName)), videoName);
    }else {
        vscode.window.showErrorMessage(`Video file extension must be 'mp4' or 'avi'`);
    }


    const auth = 'Basic ' + Buffer.from(token + ':').toString('base64');

    try {
        let res = await got.post(url, {
            body: formData,
            headers: {
                "Authorization": auth
            }
        });

        vscode.window.showInformationMessage('Success upload video');
    } catch (e) {
        vscode.window.showErrorMessage(`Video upload failed`);
    }
}

export async function downloadVideo(url: string, targetPath: string, info: vscode.Memento, labName: string, fileName: string) {
    const token = await info.get('token');

    const auth = 'Basic ' + Buffer.from(token + ':').toString('base64');


    if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath);
    }

    const saveFilePath = path.join(targetPath, fileName);
    axios.get(url, { auth: { username: token } })
    .then((res: any) => {
        downloadImage(urlJoin(url, fileName), saveFilePath, auth);
        vscode.window.showInformationMessage(`${fileName} download successfully.`);
    })
    .catch((err: any) => {
        vscode.window.showErrorMessage(`Fail download ${fileName} in ${labName}`);
    });
}

export async function deleteVideo(url: string, targetPath: string, info: vscode.Memento) {
    const token = await info.get('token');

    const auth = 'Basic ' + Buffer.from(token + ':').toString('base64');

    axios.delete(url, { auth: { username: token }})
    .then((res: any) => {
        vscode.window.showInformationMessage(`Video delete successful`);
    })
    .catch((err: any) => {
        vscode.window.showErrorMessage(`Video delete Fail`);
    });
}
