import * as path from "path";
import { existsSync } from "fs";
import { window, workspace } from "vscode";
import { showInfo, showWarning } from "../utils";

const fs = require("fs").promises;

const EXTENSION: any = ".rekoder";

async function exists(path: string) {
	try {
		await fs.access(path);
		return true;
	} catch {
		return false;
	}
}

export function showErrorMessage(message: string) {
	window.showErrorMessage(
		typeof message === "string" ? message : JSON.stringify(message)
	);
}

export async function createFile(path: string) {
	try {
		fs.writeFile(path, "");
	} catch (e) {
		console.log("e : ", e);
		return e;
	}
}

export async function createDir(path: string) {
	try {
		await fs.mkdir(path);
		return [true, null];
	} catch (err: any) {
		if (err.code !== "EEXIST") {
			return [true, null];
		}
		return [false, err];
	}
}

export const getProjectPath = async () => {
	const workspaceUri =
		(workspace.workspaceFolders && workspace.workspaceFolders[0].uri.fsPath) ||
		"";

	const extensionUri = path.join(workspaceUri, EXTENSION);
	if (!existsSync(extensionUri)) {
		const [success, err] = await createDir(extensionUri);
		if (!success) {
			showErrorMessage(err);
		}
	}

	return extensionUri;
};

export async function initRekorderFolder(filename: string | undefined) {
	const rekoderSavingURI = await getProjectPath();

	const name = (filename || Date.now()) + EXTENSION;
	const filePath: string = rekoderSavingURI + "/" + name;

	const fileExist = await exists(filePath);

	if (fileExist) {
		showWarning(
			"File already exist, session recording will be appended to " + name
		);
	} else {
		await createFile(filePath);
		console.log("filename was added : ");
		showInfo("Session file created successfully!");
	}

	return filePath;
}
