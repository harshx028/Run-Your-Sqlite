import * as vscode from "vscode";
import * as fs from "fs";
import path from "path";
export function activate(context: vscode.ExtensionContext) {
  const basePath = vscode.Uri.joinPath(context.extensionUri, "src", "web");
  const distPath = vscode.Uri.joinPath(basePath, "dist");
  const files = fs.readdirSync(distPath.fsPath);
  const cssFile = files.find((e: any) => e.endsWith(".css")) ?? "index.css";
  const jsFile = files.find((e: any) => e.endsWith(".js")) ?? "index.js";
  const htmlPath = vscode.Uri.joinPath(distPath, "index.html");

  const disposable = vscode.commands.registerCommand(
    "run-your-sqlite.helloWorld",
    () => {
      const panel = vscode.window.createWebviewPanel(
        "run-sqlite.dashboard",
        "Run Your Sqlite",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.joinPath(context.extensionUri, "src", "web", "dist"),
          ],
        },
      );

      const cssUri = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(basePath, "dist", cssFile.toString()),
      );
      const jsUri = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(basePath, "dist", jsFile.toString()),
      );

      let html: string = fs.readFileSync(htmlPath.fsPath, "utf-8");
      html = html.replace(/"(.*?)"/g, (match, p1) => {
        if (p1.endsWith(".js") || p1.endsWith(".css")) {
          const uri = panel.webview.asWebviewUri(
            vscode.Uri.joinPath(distPath, p1),
          );
          return `"${uri}"`;
        }
        return match;
      });
      console.log(cssUri.toString());
      console.log(jsUri.toString());
      panel.webview.html = html;
    },
  );

  context.subscriptions.push(disposable);
}
export function deactivate() {}
