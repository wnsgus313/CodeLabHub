import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import got from 'got';
import { downloadImage } from './problem';
import FormData = require('form-data');

export async function uploadVideo(url: string, targetPath: string, info: vscode.Memento) {
    const formData = new FormData();
    const token = await info.get('token');

    let fileLists: string[] = fs.readdirSync(targetPath);

    fileLists.forEach((file) => {
        let reg = /(.*?)\.(mp4|avi)$/;
        if (file.match(reg)) {
            formData.append('file', fs.createReadStream(path.join(targetPath, file)), file);
        }
    });

    const auth = 'Basic ' + Buffer.from(token + ':').toString('base64');

    try {
        let res = await got.post(url, {
            body: formData,
            headers: {
                "Authorization": auth
            }
        });

        vscode.window.showInformationMessage('Sucess upload video');
    } catch (e) {
        vscode.window.showErrorMessage(`Video upload failed`);
    }
}

export async function uploadVideoTA(url: string, targetPath: string, info: vscode.Memento) {
    const formData = new FormData();
    const token = await info.get('token');

    let fileLists: string[] = fs.readdirSync(targetPath);

    fileLists.forEach((file) => {
        let reg = /(.*?)\.(mp4|avi)$/;
        if (file.match(reg)) {
            formData.append('file', fs.createReadStream(path.join(targetPath, file)), file);
        }
    });

    const auth = 'Basic ' + Buffer.from(token + ':').toString('base64');

    try {
        let res = await got.post(url, {
            body: formData,
            headers: {
                "Authorization": auth
            }
        });

        vscode.window.showInformationMessage('Sucess upload video');
    } catch (e) {
        vscode.window.showErrorMessage(`Video upload failed`);
    }
}

export async function downloadVideo(url: string, targetPath: string, info: vscode.Memento, res2: string) {


    const axios = require('axios');

    const token = await info.get('token');

    const auth = 'Basic ' + Buffer.from(token + ':').toString('base64');

    axios.get(url, { auth: { username: token } })
    .then((res: any) => {
        if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath);
        }
        res.data['file_list'].forEach((filename: string) => {
            const saveFilePath = targetPath  + '/' + filename;
            axios.get(url, { auth: { username: token } })
            .then((res: any) => {
                downloadImage(url + '/' + filename, saveFilePath, auth);
                vscode.window.showInformationMessage(`${filename} save successfully.`);
            })
            .catch((err: any) => {
                vscode.window.showErrorMessage(`Fail save ${filename} in ${res2}`);
            });
        });
    })
    .catch((err: any) => {
        vscode.window.showErrorMessage(`모르겠어요`);
    });
}

