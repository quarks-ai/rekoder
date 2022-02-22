import * as vscode from "vscode";

export function showInfo(message: string) {
	vscode.window.showInformationMessage(message);
}

export function showError(message: string) {
	vscode.window.showErrorMessage(message);
}

export function showWarning(message: string) {
	vscode.window.showWarningMessage(message);
}

export function showInput(placeHolder: string, prompt: string = "") {
	return vscode.window.showInputBox({
		placeHolder,
		prompt,
	});
}
