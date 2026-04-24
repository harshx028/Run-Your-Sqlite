import { readFile, readFileSync } from 'fs';
import path from 'path';
import * as vscode from 'vscode';
const getNonce = () => crypto.randomUUID().toString();
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "run-your-sqlite" is now active!');
	const basePath = vscode.Uri.joinPath(context.extensionUri, "src", "sqlite-ui", "dist");
	const htmlPath = vscode.Uri.joinPath(basePath, "index.html");
	console.log(basePath.toString());
	const nonce = getNonce();
	let html = readFileSync(htmlPath.fsPath, "utf-8");
	const disposable = vscode.commands.registerCommand('run-your-sqlite.openUI', () => {
		const panel = vscode.window.createWebviewPanel(
			'runYourSqlite',
			'Run Your SQLite',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'sqlite-ui/dist')]
			}
		);
		const webview = panel.webview;
		html = html.replace(/(src|href)="([^"]+)"/g, (_, attr, path) => {
			if (path.startsWith('http') || path.startsWith('data:')) {
				return `${attr}="${path}"`;
			}

			const fileUri = vscode.Uri.joinPath(basePath, path);
			const webviewUri = webview.asWebviewUri(fileUri);

			return `${attr}="${webviewUri}"`;
		});
		webview.html = html;
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
