import * as vscode from 'vscode';
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "run-your-sqlite" is now active!');
	const disposable = vscode.commands.registerCommand('run-your-sqlite.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Run Your Sqlite!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
