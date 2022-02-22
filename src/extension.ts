import * as vscode from "vscode";

import { COMMAND_START_RECORDING } from "./const";
import { initRekorderFolder } from "./filesystem";
import { showInput } from "./utils";

export function activate(context: vscode.ExtensionContext) {
	let startRecording = vscode.commands.registerCommand(
		COMMAND_START_RECORDING,
		async () => {
			const filename = await showInput(
				"",
				"Enter the filename where you want to save session recording"
			);

			const rekoderSavingURI = await initRekorderFolder(filename);

			console.log("result : ", rekoderSavingURI);
		}
	);

	context.subscriptions.push(startRecording);
}

export function deactivate() {}
