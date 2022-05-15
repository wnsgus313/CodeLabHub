import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class LabProvider implements vscode.TreeDataProvider<Dependency> {
    private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | void> = new vscode.EventEmitter<Dependency | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | void> = this._onDidChangeTreeData.event;

    constructor(private workspaceRoot: string | any, private info: vscode.Memento) {
	}

    refresh(): void {
		this._onDidChangeTreeData.fire();
	}

    private pathExists(p: string): boolean {
		try {
			fs.accessSync(p);
		} catch (err) {
			return false;
		}

		return true;
	}

    getTreeItem(element: Dependency): vscode.TreeItem {
        let labJsonPath = path.join(this.workspaceRoot, 'labs.json');

		return element;
    }

    getChildren(element?: Dependency): Thenable<Dependency[]> {
		if (!this.workspaceRoot) {
			vscode.window.showInformationMessage('No workspace');
			return Promise.resolve([]);
		}
        const labJsonPath = path.join(this.workspaceRoot, 'labs.json'); // labs.json 경로
        console.log(element);
		if (element) {
            if(element.contextValue === 'labs'){
                return Promise.resolve(this.makeFunction(element.order, element.role)); // 몇번째 lab인지 알 수 있도록
            }
            else if(element.contextValue?.substring(0,8) === 'problems'){
                return Promise.resolve(this.makeProblem(labJsonPath, element.order));
            }
            else if(element.contextValue?.substring(0, 7) === 'members'){
                return Promise.resolve(this.makeMember(labJsonPath, element.order));
            }

			return Promise.resolve([]);
		} else {
            console.log('get children');
			if (this.pathExists(labJsonPath)) {
				return Promise.resolve(this.makeLab(labJsonPath));
			} else {
				vscode.window.showInformationMessage('Workspace has no labs.json');
				return Promise.resolve([]);
			}
		}
    }

    // lab 추가
	private makeLab(labJsonPath: string): Dependency[] {
        console.log("🚀 ~ file: lab.ts ~ line 45 ~ LabProvider ~ makeLab ~ labPath", labJsonPath);
		if (this.pathExists(labJsonPath)) {
			const labJson = JSON.parse(fs.readFileSync(labJsonPath, 'utf-8'));
            const roles = labJson['roles'];

			const parseLab = (labName: string, index: number): Dependency => {
				return new Dependency(labName, vscode.TreeItemCollapsibleState.Collapsed, "labs", index, roles[index]);
			};

            let labs:string[] = [];
            for(let i=0; i<Object.keys(labJson['labs']).length; i++){
                console.log("🚀 ~ file: lab.ts ~ line 60 ~ LabProvider ~ makeLab ~ i", i);

                labs.push(labJson['labs'][i]['lab']);
            }
            this.info.update('lab_count', Object.keys(labJson['labs']).length); // lab의 개수 저장
            let res = labs.map((lab, index) => parseLab(lab, index));

			return res.concat(new Dependency('Useful Extensions', vscode.TreeItemCollapsibleState.Collapsed, "Useful"));
		} else {
			return [];
		}
    }

    // 문제 추가
    private makeProblem(labJsonPath: string, order: number | any): Dependency[] {
        if (this.pathExists(labJsonPath)) {
			const labJson = JSON.parse(fs.readFileSync(labJsonPath, 'utf-8'));
            console.log('makeProblem');
			const parseProblem = (problem: string): Dependency => {
				return new Dependency(problem, vscode.TreeItemCollapsibleState.None, 'problem_'+labJson['roles'][order], labJson['roles'][order]); // problem들 가져오기
			};

            let problems:string[] = [];
            for(let i=0; i<Object.keys(labJson['labs'][order]['problems']).length; i++){
                problems.push(labJson['labs'][order]['problems'][i]);
            }
            let res = problems.map(lab => parseProblem(lab));

			return res;
		} else {
			return [];
		}
    }

    // 기능 추가
    private makeFunction(order: number | undefined, role: string | undefined)
    {
        let res: Dependency[] = [];
        if(role === 'admin'){
            res.push(new Dependency("Problem", vscode.TreeItemCollapsibleState.Collapsed, 'problems_'+role, order, role));
            res.push(new Dependency("Member", vscode.TreeItemCollapsibleState.Collapsed, 'members', order, role));
            res.push(new Dependency("Submission", vscode.TreeItemCollapsibleState.Collapsed, 'submissions', order, role));
            res.push(new Dependency("Class chat", vscode.TreeItemCollapsibleState.None, 'chat', order, role));
            res.push(new Dependency("TA", vscode.TreeItemCollapsibleState.None, "ta", order, role));
        }
        else if(role === 'student'){
            res.push(new Dependency("Problem", vscode.TreeItemCollapsibleState.Collapsed, 'problems_' + role, order, role));
            res.push(new Dependency("Member", vscode.TreeItemCollapsibleState.Collapsed, 'members_' + role, order, role));
            res.push(new Dependency("Evaluation", vscode.TreeItemCollapsibleState.Collapsed, 'evaluations', order, role));
            res.push(new Dependency("Class chat", vscode.TreeItemCollapsibleState.None, 'chat', order, role));
            res.push(new Dependency("TA", vscode.TreeItemCollapsibleState.None, "ta", order, role));
        }

        return res;
    }

    // 멤버 추가
    private makeMember(labJsonPath: string, order: number | any){
        if (this.pathExists(labJsonPath)) {
			const labJson = JSON.parse(fs.readFileSync(labJsonPath, 'utf-8'));
            console.log('makeMember');
			const parseMember = (member: string): Dependency => {
				return new Dependency(member, vscode.TreeItemCollapsibleState.None, 'member_'+labJson['roles'][order], labJson['roles'][order]); // problem들 가져오기
			};

            let members:string[] = [];
            for(let i=0; i<Object.keys(labJson['labs'][order]['members']).length; i++){
                members.push(labJson['labs'][order]['members'][i]);
            }
            let res = members.map(member => parseMember(member));

			return res;
		} else {
			return [];
		}
    }

}

export class Dependency extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly contextValue?: string, // label과 비슷한 기능으로 하위 트리 만들 떄 사용
        public readonly order?: number, // labs 순서를 알 수 있도록
        public readonly role?: string, // 권한
        public readonly description?: string,
        public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
		this.contextValue = contextValue;
        this.description = description;
        this.order = order;
        this.role = role;
        this.command = command;
	}
}