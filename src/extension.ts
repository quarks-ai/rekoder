import * as vscode from "vscode";
import * as fs from "fs";

import { COMMAND_START_RECORDING } from "./const";
import { initRekorderFolder } from "./filesystem";
import { showInput } from "./utils";

export type Player = {
  file: string;
  language: string;
  selection: string;
  value: string;
  timestamp: Date;
  type: string;
  position: string[];
};

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
      let ws = fs.createWriteStream(rekoderSavingURI);
      let changes: Player[] = [];

      vscode.workspace.onDidChangeTextDocument(logChanges);

      function logChanges(e: vscode.TextDocumentChangeEvent) {
        if (changes.length > 0) {
          if (e.document.uri.path !== changes[changes.length - 1].file) {
            console.log("change document");
          }
        }

        e.contentChanges.forEach((c) => {
          let change: Player = {
            file: e.document.uri.path,
            language: "ts",
            selection: "",
            value: c.text,
            timestamp: new Date(),
            type: "",
            position: [],
          };
          changes.push(change);
          console.log(changes);
          ws.write(c.text);
        });
        console.log(changes);
      }
    }
  );

  context.subscriptions.push(startRecording);
}

export function deactivate() {}
